import { isNil, isPlainObject } from 'lodash-es';
import React, {
  MutableRefObject,
  PropsWithChildren,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { Dimensions, NativeMethods, View, ViewProps } from 'react-native';

interface ViewportProps extends ViewProps {
  disabled?: boolean;
  delay?: number;
  trackingId?: string;
  style?: ViewProps['style'];
  threshold?: number;
  transitionTimer?: number;
  onChange: (isVisible?: boolean) => void;
}

export type EnsuredRef<C> = MutableRefObject<C | null>;

export const useEnsuredRef = <C extends NativeMethods & React.Component<any>>(
  ref: Ref<C> | null
): EnsuredRef<C> => {
  const ensuredRef = useRef<C | null>(null);

  useEffect(() => {
    if (typeof ref === 'function') {
      ref(ensuredRef.current);
    } else if (ref && isPlainObject(ref)) {
      (ref as MutableRefObject<C | null>).current = ensuredRef.current;
    }
  }, []);

  return ensuredRef;
};


export function onNativeRender(callback: () => void): void {
  // We need to wait until native has rendered a frame before measuring will
  // return non-zero results. Use RAF to schedule work on the next render, to
  // then shceduled work on the render after (at which point we should be all
  // good).
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      callback();
    });
  });
}

const isInViewPort = (rect: { top: number; bottom: number; width: number }, threshold = 0.2) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

  const { bottom, top, width } = rect;

  return bottom !== 0 &&
    top >= 0 &&
    top <= screenHeight * threshold &&
    width > 0 &&
    width <= screenWidth;
};

const ViewportTracker: React.FC<PropsWithChildren<ViewportProps>> = ({
  children,
  disabled,
  delay = 1000,
  threshold,
  trackingId,
  transitionTimer = 300,
  onChange,
  ...props
}) => {
  const [visible, setVisible] = useState<boolean | void>();
  const [hasTransitioned, setHasTransitioned] = useState(false);

  const viewRef = useRef<View | null>(null);

  const prevDisabledState = useRef(disabled);
  const interval = useRef<number | NodeJS.Timeout | void>();
  const prevRect = useRef({ top: 0, bottom: 0, width: 0 });

  const watch = useCallback((): void => {
    if (isNil(interval.current)) {
      interval.current = setInterval((): void => {
        viewRef?.current?.measure((_x, _y, width, height, pageX, pageY) => {
          if (!prevRect?.current || prevRect.current?.top !== pageY) {
            const rect = {
              top: pageY,
              bottom: pageY + height,
              width: pageX + width
            };

            const isVisible = isInViewPort(rect, threshold);

            if (`${visible}` !== `${isVisible}`) {
              setVisible(isVisible);
              onChange(isVisible);
            }

            prevRect.current = rect;
          }
        });
      }, delay);
    }
  }, []);

  useEffect(() => {
    const transition = setTimeout(() => {
      setHasTransitioned(true);
      clearTimeout(transition);
    }, transitionTimer);

    return () => {
      interval.current = clearInterval(interval.current as number);
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (viewRef?.current && hasTransitioned) {
      if (!disabled) {
        if (!isNil(disabled) && `${prevDisabledState.current}` !== `${disabled}`) {
          prevDisabledState.current = disabled;
          setVisible(false);
        }

        watch();
      } else if (disabled && interval.current) {
        interval.current = clearInterval(interval.current as number);
      }
    }
  }, [disabled, hasTransitioned]);

  return (
    <View
      collapsable={false}
      ref={viewRef}
      {...props}
    >
      {children}
    </View>
  );
};

ViewportTracker.displayName = 'ViewportTracker';

export { ViewportTracker };

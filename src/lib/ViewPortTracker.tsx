import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, ViewProps } from 'react-native';

export interface ViewPortTrackerProps extends ViewProps {
  disabled?: boolean;
  interval?: number;
  onChange?: (visible: boolean, shouldPlayVideo: boolean, layout: ViewSize) => void;
  children?: React.ReactNode;
  thresholdTopPx?: number;
  thresholdBottomPx?: number;
  uniqueId: string;
  videoIndex: number;
}

export interface ViewSize {
  top: number;
  bottom: number;
  width: number;
}

// interface ViewsInViewport {
//   [key: string]: number;
// }

// const viewsInsideViewport = (function () {
//   const viewsInViewport: ViewsInViewport = {};

//   function setViews(viewId: string, index: number): void {
//     if (!(viewId in viewsInViewport)) viewsInViewport[viewId] = index;
//   }

//   function deleteView(viewId: string): void {
//     if (viewId in viewsInViewport) delete viewsInViewport[viewId];
//   }

//   return {
//     setViews(viewId: string, index: number) {
//       setViews(viewId, index);
//     },
//     deleteView(viewId: string) {
//       deleteView(viewId);
//     },
//     getViews() {
//       return viewsInViewport;
//     }
//   };
// })();

const isInWindow = (viewSize: ViewSize, thresholdTopPx = 50, thresholdBottomPx = 200) => {
  const window = Dimensions.get('window');
  const isInside =
    viewSize.bottom !== 0 &&
    viewSize.top >= 0 - thresholdTopPx &&
    viewSize.bottom <= window.height + thresholdBottomPx &&
    viewSize.width > 0 &&
    viewSize.width <= window.width;
  return isInside;
};

const shouldPlayVideo = (function () {
  const currentlyPlaying: { uniqueViewId: string; videoIndex: number }[] = [];

  function shouldPlay(
    isInsideViewport: boolean,
    uniqueViewId: string,
    videoIndex: number
  ): boolean {
    // console.log(`debug: view ${uniqueViewId}: `, currentlyPlaying);
    
    if (isInsideViewport) {
      if (currentlyPlaying.length === 0) {
        currentlyPlaying[0] = { uniqueViewId, videoIndex };
        return true;
      } else {
        // need to do the calculation here
        if (videoIndex > currentlyPlaying[0].videoIndex) {
          currentlyPlaying.pop;
          currentlyPlaying[0] = { uniqueViewId, videoIndex };
          return true;
        }
        return false;
      }
    } else {
      if (currentlyPlaying.length > 0 && currentlyPlaying[0].uniqueViewId === uniqueViewId) {
        currentlyPlaying.pop();
      }
      return false;
    }
  }

  return {
    shouldPlay
  };
})();

// function shouldPlayVideo() {
//   // var isPlaying = false;
//   const currentlyPlaying: string[] = [];

//   return function (isInsideViewport: boolean, uniqueViewId: string, viewsInViewport: ViewsInViewport): boolean {
//     if (isInsideViewport) {
//       if (currentlyPlaying.length === 0) {
//         currentlyPlaying[0] = uniqueViewId;
//         return true;
//       } else {
//         // another video inside viewport already playing
//         return currentlyPlaying[0] === uniqueViewId;
//       }
//     } else {
//       // view out of viewport
//       if (currentlyPlaying.length > 0 && currentlyPlaying[0] === uniqueViewId) {
//         currentlyPlaying.pop();
//       }
//       return false;
//     }
//   };
// }

// const ShouldPlayClosure = shouldPlayVideo()

const ViewPortTracker = (props: ViewPortTrackerProps): JSX.Element => {
  const { disabled, interval, ...viewProps } = props;

  // @ts-ignore
  const [rect, setRect] = useState<ViewSize>({ top: 0, bottom: 0, width: 0 });
  const [playing, setPlaying] = useState<boolean>(false);
  const viewRef = useRef<View>(null);
  const wasVisible = useRef<boolean | null>(null);

  useEffect(() => {
    if (props.disabled) return;

    const timer = setInterval(() => {
      if (!viewRef.current) return;

      viewRef.current.measure((x, y, width, height, pageX, pageY) => {
        let rect: ViewSize = {
          top: pageY,
          bottom: pageY + height,
          width: pageX + width
        };
        setRect(rect);

        const visible = isInWindow(rect, props.thresholdTopPx, props.thresholdBottomPx);
        const shouldPlay = shouldPlayVideo.shouldPlay(visible, props.uniqueId, props.videoIndex);
        setPlaying(shouldPlay);
        
        if (visible !== wasVisible.current) {
          props.onChange?.(visible, shouldPlay, rect);
          wasVisible.current = visible;
        }
      });
    }, props.interval || 100);

    return () => {
      wasVisible.current = null;
      clearInterval(timer);
    };
  }, [props.interval, props.disabled]);

  return (
    <View ref={viewRef} collapsable={false} {...viewProps}>
      {props.children}
    </View>
  );
};

export default ViewPortTracker;

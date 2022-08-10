import * as React from 'react';
import { ViewProps } from 'react-native';
export interface ViewPortTrackerProps extends ViewProps {
  disabled?: boolean;
  interval?: number;
  onChange?: (visible: boolean, layout: ViewSize) => void;
  children?: React.ReactNode;
}
export interface ViewSize {
  top: number;
  bottom: number;
  width: number;
}
export default function ViewPortTracker(props: ViewPortTrackerProps): any;

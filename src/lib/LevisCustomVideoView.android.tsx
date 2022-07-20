import React from 'react';
import { Platform, requireNativeComponent, ViewProps } from 'react-native';

interface RCTLeviCustomVideoViewProps extends ViewProps {
  src: { uri: string };
  paused: boolean;
  repeat: boolean;
  muted: boolean;
  // height?: number;
  // width?: number;
  displayMode: 'contain' | 'center' | 'cover' | 'none' | 'stretch';
  onVideoLoad?: (a: any) => void;
  enableVideoControls?: boolean;
}

const RCTLeviCustomVideoView =
  requireNativeComponent<RCTLeviCustomVideoViewProps>('RCTLeviCustomVideoView');

const CustomVideoView = (props: RCTLeviCustomVideoViewProps) =>
  Platform.OS === 'android' ? <RCTLeviCustomVideoView {...props} /> : null;

export default CustomVideoView;

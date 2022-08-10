import React, {
  FC,
  memo,
  NamedExoticComponent,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  requireNativeComponent,
  ScrollView,
  Text,
  View
} from 'react-native';
import Video from 'react-native-video';
import ViewPortTracker from '../lib/ViewPortTracker';
import CustomVideoView from '../lib/LevisCustomVideoView.android';
import { ViewSize } from '../types/ViewPortTracker';

type VideoData = {
  uri: string;
  index: number;
  height: number | string;
  width: number | string;
  label?: string;
};

const data: VideoData[] = [
  {
    uri: 'https://s7d2.scene7.com/is/content/lscoecomm/IMG_1552-0x240-195k-1',
    // uri: 'http://techslides.com/demos/sample-videos/small.mp4',
    index: 1,
    height: 600,
    width: '100%',
    label: 'View 1'
  },
  {
    uri: 'https://s7d2.scene7.com/is/content/lscoecomm/JaxAndCat-0x480-1195k',
    // uri: 'http://techslides.com/demos/sample-videos/small.mp4',
    index: 2,
    height: 600,
    width: '100%',
    label: 'View 2'
  },
  {
    uri: 'https://s7d2.scene7.com/is/content/lscoecomm/momjeansoutontown-0x720-2495k',
    // uri: 'https://www.youtube.com/watch?v=3gS3WwZ33tk',
    index: 3,
    height: 200,
    width: '100%',
    label: 'View 3'
  }
  // {
  //   uri: 'https://s7d2.scene7.com/is/content/lscoecomm/IMG_1552-0x240-195k-1',
  //   // uri: 'https://www.youtube.com/watch?v=3gS3WwZ33tk',
  //   index: 4,
  //   height: 600,
  //   width: '100%',
  //   label: 'View 4'
  // }
];

export const VideoList: NamedExoticComponent<{}> = memo<{}>(() => {
  // const keyExtractor = (item: VideoData, index: number): string => item.index.toString();
  // const renderItem = ({ item }: ListRenderItemInfo<VideoData>): ReactElement => {
  //   return (
  //     <View style={{ marginBottom: 20 }}>
  //       <Video
  //         source={{ uri: item.uri }}
  //         style={{ height: item.height, width: item.width }}
  //         resizeMode={'cover'}
  //         repeat={true}
  //         muted={true}
  //       />
  //     </View>
  //   );
  // };

  // const renderCallbackItem = (item: VideoData, index: number) => {
  //   return (
  //     <View style={{ borderWidth: 2, borderColor: 'yellow' }}>
  //       <CustomVideoView
  //         key={keyExtractor(item, index)}
  //         src={{ uri: item.uri }}
  //         paused={false}
  //         repeat={true}
  //         muted={true}
  //         displayMode={'center'}
  //         style={{ height: item.height, width: item.width }}
  //         onVideoLoad={(a: any) => {
  //           console.log('debug: on Video load: ', a);
  //         }}
  //       />
  //     </View>
  //   );
  // };

  // const checkVisible = (isVisible: boolean, layout: ViewSize) => {
  //   console.log('debug: isVisible: ', { isVisible, layout });
  // };

  // const url = 'https://s7d2.scene7.com/is/content/lscoecomm/JaxAndCat-0x480-1195k';
  // const height = 220.90909090909093;
  // const width = 392.72727272727275;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'grey' }}>
      {data.map((item, index) => {
        return <RenderViewWithViewport index={index} item={item} />;
      })}
    </ScrollView>
  );
});

const RenderViewWithViewport: FC<{ item: VideoData; index: number }> = ({
  item,
  index
}): JSX.Element => {
  const [text, setText] = useState<string>('');
  return (
    <ViewPortTracker
      uniqueId={item.index.toString()}
      videoIndex={index}
      onChange={(visible: boolean, shouldPlayVideo: boolean, rect: any) => {
        console.log(`debug: ${item.label}: `, { visible, shouldPlayVideo, rect });
        setText(JSON.stringify({ visible, shouldPlayVideo }));
      }}
    >
      <View style={{ borderWidth: 2, borderColor: 'yellow', height: item.height }}>
        <Text>{item.label ?? ''}: {item.index}</Text>
        <Text>{text}</Text>
      </View>
    </ViewPortTracker>
  );
};

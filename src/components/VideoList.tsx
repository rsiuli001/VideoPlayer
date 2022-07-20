import React, { memo, NamedExoticComponent, ReactElement, useCallback, useEffect } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  requireNativeComponent,
  ScrollView,
  Text,
  View
} from 'react-native';
import Video from 'react-native-video';
import CustomVideoView from '../lib/LevisCustomVideoView.android';

type VideoData = {
  uri: string;
  index: number;
  height: number | string;
  width: number | string;
};

const data: VideoData[] = [
  {
    uri: 'https://s7d2.scene7.com/is/content/lscoecomm/IMG_1552-0x240-195k-1',
    // uri: 'http://techslides.com/demos/sample-videos/small.mp4',
    index: 1,
    height: 200,
    width: '100%'
  },
  {
    uri: 'https://s7d2.scene7.com/is/content/lscoecomm/JaxAndCat-0x480-1195k',
    // uri: 'http://techslides.com/demos/sample-videos/small.mp4',
    index: 2,
    height: 300,
    width: '100%'
  },
  {
    uri: 'https://s7d2.scene7.com/is/content/lscoecomm/momjeansoutontown-0x720-2495k',
    // uri: 'https://www.youtube.com/watch?v=3gS3WwZ33tk',
    index: 3,
    height: 500,
    width: '100%'
  },
  {
    uri: 'https://s7d2.scene7.com/is/content/lscoecomm/IMG_1552-0x240-195k-1',
    // uri: 'https://www.youtube.com/watch?v=3gS3WwZ33tk',
    index: 4,
    height: 600,
    width: '100%'
  }
];

export const VideoList: NamedExoticComponent<{}> = memo<{}>(() => {
  const keyExtractor = (item: VideoData, index: number): string => item.index.toString();
  const renderItem = ({ item }: ListRenderItemInfo<VideoData>): ReactElement => {
    return (
      <View style={{ marginBottom: 20 }}>
        <Video
          source={{ uri: item.uri }}
          style={{ height: item.height, width: item.width }}
          resizeMode={'cover'}
          repeat={true}
          muted={true}
        />
      </View>
    );
  };

  const renderCallbackItem = (item: VideoData, index: number) => {
    return (
      <View style={{ borderWidth: 2, borderColor: 'yellow' }}>
        <CustomVideoView
          key={keyExtractor(item, index)}
          src={{ uri: item.uri }}
          paused={false}
          repeat={true}
          muted={true}
          displayMode={'center'}
          style={{ height: item.height, width: item.width }}
          onVideoLoad={(a: any) => {
            console.log('debug: on Video load: ', a);
          }}
        />
      </View>
    );
  };

  const url = 'https://s7d2.scene7.com/is/content/lscoecomm/JaxAndCat-0x480-1195k';
  const height = 220.90909090909093;
  const width = 392.72727272727275;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'grey' }}>
      {/* {data.map((item, index) => {
        return renderCallbackItem(item, index);
      })} */}
      {/* {renderCallbackItem(data[0], 0)}
      {renderCallbackItem(data[2], 0)}
      <View style={{height: 20, backgroundColor: 'red'}}></View> */}
      {/* <View style={{ borderWidth: 2, borderColor: 'yellow' }}>
        <CustomVideoView
          // key={keyExtractor(item, index)}
          src={{ uri: data[0].uri }}
          paused={false}
          repeat={true}
          muted={true}
          displayMode={'cover'}
          style={{ height:  data[0].height, width:  data[0].width }}
          onVideoLoad={(a: any) => {
            console.log('debug: on Video load: ', a);
          }}
          enableVideoControls={true}
        />
      </View>
      <View style={{borderWidth: 2, borderColor: 'yellow'}}>
        <CustomVideoView
          // key={keyExtractor(item, index)}
          src={{ uri: data[1].uri }}
          paused={false}
          repeat={true}
          muted={true}
          displayMode={'cover'}
          style={{ height: data[2].height, width: data[2].width }}
          onVideoLoad={(a: any) => {
            console.log('debug: on Video load: ', a);
          }}
          enableVideoControls={true}
        />
      </View>
      <View style={{borderWidth: 2, borderColor: 'yellow'}}>
        <CustomVideoView
          // key={keyExtractor(item, index)}
          src={{ uri: data[1].uri }}
          paused={false}
          repeat={true}
          muted={true}
          displayMode={'cover'}
          style={{ height: data[2].height, width: data[2].width }}
          onVideoLoad={(a: any) => {
            console.log('debug: on Video load: ', a);
          }}
          enableVideoControls={true}
        />
      </View> */}
      <View style={{ borderWidth: 2, borderColor: 'yellow' }}>
        <Video
          source={{ uri: url }}
          style={{ height, width }}
          resizeMode={'cover'}
          repeat={true}
          muted={true}
        />
      </View>
      <View style={{ borderWidth: 2, borderColor: 'yellow' }}>
        <CustomVideoView
          // key={keyExtractor(item, index)}
          src={{ uri: url }}
          paused={false}
          repeat={true}
          muted={true}
          // height={731.4285714285714}
          // width={411.42857142857144}
          displayMode={'cover'}
          style={{ height, width }}
          onVideoLoad={(a: any) => {
            console.log('debug: on Video load: ', a);
          }}
          enableVideoControls={true}
        />
      </View>
    </ScrollView>
  );
});

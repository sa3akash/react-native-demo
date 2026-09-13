import React from 'react';
import { View } from 'react-native';

export enum ResizeMode {
  CONTAIN = 'contain',
  COVER = 'cover',
  STRETCH = 'stretch',
  NONE = 'none',
}

export enum SelectedTrackType {
  SYSTEM = 'system',
  DISABLED = 'disabled',
  TITLE = 'title',
  LANGUAGE = 'language',
  INDEX = 'index',
  RESOLUTION = 'resolution',
}

const Video = React.forwardRef<any, any>((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    seek: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    presentFullscreenPlayer: jest.fn(),
    dismissFullscreenPlayer: jest.fn(),
  }));

  return <View testID="react-native-video-mock" {...props} />;
});

export default Video;

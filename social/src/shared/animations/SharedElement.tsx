import React from 'react';
import { StyleProp, ViewStyle, ImageStyle } from 'react-native';
import Animated from 'react-native-reanimated';

export interface SharedElementProps {
  id: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SharedElement: React.FC<SharedElementProps> = ({ id, children, style }) => {
  return (
    <Animated.View sharedTransitionTag={id} style={style}>
      {children}
    </Animated.View>
  );
};

export interface SharedImageProps {
  id: string;
  source: { uri: string };
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

export const SharedImage: React.FC<SharedImageProps> = ({ id, source, style, resizeMode = 'cover' }) => {
  return (
    <Animated.Image
      sharedTransitionTag={id}
      source={source}
      style={style}
      resizeMode={resizeMode}
    />
  );
};

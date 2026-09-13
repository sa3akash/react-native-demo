import React from 'react';
import { View, Image, Text, ScrollView } from 'react-native';

const createMockComponent = (Component: any) =>
  React.forwardRef((props: any, ref: any) =>
    React.createElement(Component, { ...props, ref })
  );

const Animated: any = {
  View: createMockComponent(View),
  Text: createMockComponent(Text),
  Image: createMockComponent(Image),
  ScrollView: createMockComponent(ScrollView),
  createAnimatedComponent: (Comp: any) => createMockComponent(Comp),
};

export const useSharedValue = (initial: any) => ({ value: initial });
export const useAnimatedStyle = (fn: any) => fn();
export const withTiming = (val: any) => val;
export const withSpring = (val: any) => val;
export const withSequence = (...vals: any[]) => vals[vals.length - 1];
export const withDelay = (_delay: any, val: any) => val;
export const withRepeat = (val: any) => val;
export const cancelAnimation = () => {};
export const runOnJS = (fn: any) => fn;
export const runOnUI = (fn: any) => fn;

export const FadeIn = { duration: () => FadeIn, delay: () => FadeIn };
export const FadeOut = { duration: () => FadeOut, delay: () => FadeOut };
export const SlideInDown = { duration: () => SlideInDown, delay: () => SlideInDown };
export const SlideOutDown = { duration: () => SlideOutDown, delay: () => SlideOutDown };
export const ZoomIn = { duration: () => ZoomIn, delay: () => ZoomIn };
export const ZoomOut = { duration: () => ZoomOut, delay: () => ZoomOut };

export default Animated;

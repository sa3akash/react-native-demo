import React from 'react';
import { View } from 'react-native';

const LottieView = React.forwardRef((props: any, ref: any) => {
  return React.createElement(View, { ...props, ref });
});

export default LottieView;

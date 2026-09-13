/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Responsive Scaling & Device Layout Utility
 */

import { Dimensions, PixelRatio } from 'react-native';

// Baseline mobile layout dimensions (iPhone 14 / standard mobile design frame)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Scales width relative to baseline device screen width.
 */
export const scale = (size: number): number => {
  const currentWidth = Dimensions.get('window').width;
  return Math.round(PixelRatio.roundToNearestPixel((currentWidth / BASE_WIDTH) * size));
};

/**
 * Scales height relative to baseline device screen height.
 */
export const verticalScale = (size: number): number => {
  const currentHeight = Dimensions.get('window').height;
  return Math.round(PixelRatio.roundToNearestPixel((currentHeight / BASE_HEIGHT) * size));
};

/**
 * Moderated scale for paddings, margins, and border radius.
 * Prevents extreme scaling on large screens and tablets.
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return Math.round(size + (scale(size) - size) * factor);
};

/**
 * Responsive font size scaling capped to prevent text overflow.
 */
export const responsiveFontSize = (fontSize: number, factor: number = 0.4): number => {
  const scaledSize = moderateScale(fontSize, factor);
  return Math.min(scaledSize, fontSize * 1.3);
};

export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
    isTablet: width >= 768,
    isSmallDevice: width < 360,
  };
};

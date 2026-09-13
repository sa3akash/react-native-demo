import { Dimensions, PixelRatio, Platform } from 'react-native';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Base guideline dimensions (iPhone 14 / standard 390x844 reference)
const GUIDELINE_BASE_WIDTH = 390;
const GUIDELINE_BASE_HEIGHT = 844;

export interface ResponsiveMetrics {
  width: number;
  height: number;
  pixelRatio: number;
  fontScale: number;
  breakpoint: Breakpoint;
  isSmallPhone: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  scale: (size: number) => number;
  verticalScale: (size: number) => number;
  moderateScale: (size: number, factor?: number) => number;
  fontScaleSize: (size: number) => number;
  wp: (percentage: number) => number;
  hp: (percentage: number) => number;
}

/**
 * Calculate active responsive metrics for the current window viewport
 */
export function getResponsiveMetrics(): ResponsiveMetrics {
  const { width, height } = Dimensions.get('window');
  const pixelRatio = PixelRatio.get();
  const fontScale = PixelRatio.getFontScale();
  const isLandscape = width > height;

  // Determine standard dimension for orientation agnostic scaling
  const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];

  // Breakpoints
  let breakpoint: Breakpoint = 'sm';
  if (shortDimension < 360) {
    breakpoint = 'xs';
  } else if (shortDimension <= 414) {
    breakpoint = 'sm';
  } else if (shortDimension <= 767) {
    breakpoint = 'md';
  } else if (shortDimension <= 1024) {
    breakpoint = 'lg';
  } else {
    breakpoint = 'xl';
  }

  // Device type detection
  const isTablet = shortDimension >= 600 || (Platform.OS === 'ios' && (Platform.constants as any)?.interfaceIdiom === 'pad');
  const isSmallPhone = shortDimension < 360;

  // Scaling helpers
  const scale = (size: number) => Math.round((shortDimension / GUIDELINE_BASE_WIDTH) * size);
  const verticalScale = (size: number) => Math.round((longDimension / GUIDELINE_BASE_HEIGHT) * size);
  const moderateScale = (size: number, factor = 0.5) => Math.round(size + (scale(size) - size) * factor);
  const fontScaleSize = (size: number) => Math.round(moderateScale(size) * fontScale);
  const wp = (percentage: number) => Math.round((width * percentage) / 100);
  const hp = (percentage: number) => Math.round((height * percentage) / 100);

  return {
    width,
    height,
    pixelRatio,
    fontScale,
    breakpoint,
    isSmallPhone,
    isTablet,
    isLandscape,
    scale,
    verticalScale,
    moderateScale,
    fontScaleSize,
    wp,
    hp,
  };
}

// Standalone global exports for quick responsive calculations
export const responsive = getResponsiveMetrics();
export const scale = responsive.scale;
export const verticalScale = responsive.verticalScale;
export const moderateScale = responsive.moderateScale;
export const fontScaleSize = responsive.fontScaleSize;
export const wp = responsive.wp;
export const hp = responsive.hp;

import { useWindowDimensions } from 'react-native';
import {
  Breakpoint,
  getBreakpoint,
  resolveResponsiveValue,
  ResponsiveValue,
} from '../theme/dimensions';

export interface ResponsiveInfo {
  readonly width: number;
  readonly height: number;
  readonly breakpoint: Breakpoint;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
  readonly responsive: <T>(value: ResponsiveValue<T>) => T;
}

export const useResponsive = (): ResponsiveInfo => {
  const { width, height } = useWindowDimensions();
  const breakpoint = getBreakpoint(width);

  const isMobile = breakpoint === 'mobile' || breakpoint === 'mobileLarge';
  const isTablet = breakpoint === 'tablet' || breakpoint === 'tabletLarge';

  const responsive = <T>(value: ResponsiveValue<T>): T => resolveResponsiveValue(value, breakpoint);

  return {
    width,
    height,
    breakpoint,
    isMobile,
    isTablet,
    responsive,
  };
};

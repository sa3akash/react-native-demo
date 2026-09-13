/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Theme Context & System Types
 */

import { ViewStyle } from 'react-native';
import { colors } from '../tokens/colors';
import { typographyVariants } from '../tokens/typography';
import { ShadowElevation } from '../tokens/shadows';
import { spacing, radius } from '../tokens/spacing';
import { scale, verticalScale, moderateScale, responsiveFontSize } from '../utils/responsive';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveThemeMode = 'light' | 'dark';

export interface ThemeColors {
  // Screen & Surface
  background: string;
  surface: string;
  surfaceSecondary: string;
  border: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;
  textInverse: string;

  // Brand & Status Palette
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;

  secondary: string;
  secondaryLight: string;

  success: string;
  successLight: string;

  error: string;
  errorLight: string;

  warning: string;
  warningLight: string;

  // Raw token access
  raw: typeof colors;
}

export interface ResponsiveUtils {
  scale: typeof scale;
  verticalScale: typeof verticalScale;
  moderateScale: typeof moderateScale;
  responsiveFontSize: typeof responsiveFontSize;
  screenWidth: number;
  screenHeight: number;
  isTablet: boolean;
  isSmallDevice: boolean;
}

export interface Theme {
  mode: ActiveThemeMode;
  userPreference: ThemeMode;
  colors: ThemeColors;
  shadows: Record<ShadowElevation, ViewStyle>;
  typography: typeof typographyVariants;
  spacing: typeof spacing;
  radius: typeof radius;
  responsive: ResponsiveUtils;
}

export interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  activeMode: ActiveThemeMode;
  isDark: boolean;
  isSystem: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

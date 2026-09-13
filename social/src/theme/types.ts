export type ThemeMode = 'light' | 'dark' | 'amoled' | 'materialYou' | 'system';

export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryHover: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  surfaceElevated: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderSubtle: string;
  divider: string;
  inputBg: string;
  inputBorder: string;
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  danger: string;
  dangerBg: string;
  info: string;
  infoBg: string;
  overlay: string;
  glassBg: string;
  glassBorder: string;
  reactions: {
    like: string;
    love: string;
    care: string;
    haha: string;
    wow: string;
    sad: string;
    angry: string;
  };
  gradients: {
    storyRing: [string, string, string];
    primary: [string, string];
    live: [string, string];
    reels: [string, string];
  };
}

export interface SpacingScale {
  none: number;
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface RadiusScale {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  full: number;
}

export interface TypographyToken {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700' | '800';
  letterSpacing?: number;
}

export interface TypographyScale {
  h1: TypographyToken;
  h2: TypographyToken;
  h3: TypographyToken;
  h4: TypographyToken;
  h5: TypographyToken;
  h6: TypographyToken;
  subtitle1: TypographyToken;
  subtitle2: TypographyToken;
  body1: TypographyToken;
  body2: TypographyToken;
  caption: TypographyToken;
  overline: TypographyToken;
  buttonLarge: TypographyToken;
  buttonMedium: TypographyToken;
  buttonSmall: TypographyToken;
}

import { ResponsiveMetrics } from './responsive';

export interface Theme {
  mode: ThemeMode;
  isDark: boolean;
  colors: ColorPalette;
  spacing: SpacingScale;
  radius: RadiusScale;
  typography: TypographyScale;
  responsive: ResponsiveMetrics;
}

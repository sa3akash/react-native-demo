import { TypographyScale, SpacingScale, RadiusScale } from './types';

export const typography: TypographyScale = {
  h1: { fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.5 },
  h2: { fontSize: 26, lineHeight: 32, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.2 },
  h4: { fontSize: 18, lineHeight: 24, fontWeight: '600', letterSpacing: -0.1 },
  h5: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  h6: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  subtitle1: { fontSize: 16, lineHeight: 22, fontWeight: '500' },
  subtitle2: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  body1: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
  body2: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  overline: { fontSize: 10, lineHeight: 14, fontWeight: '600', letterSpacing: 0.8 },
  buttonLarge: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  buttonMedium: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  buttonSmall: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
};

export const spacing: SpacingScale = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius: RadiusScale = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

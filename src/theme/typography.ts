import { TextStyle } from 'react-native';

export interface TypographyStyle {
  readonly fontSize: number;
  readonly lineHeight: number;
  readonly fontWeight: TextStyle['fontWeight'];
}

export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
} as const;

export const typography = {
  heading: {
    h1: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
    } satisfies TypographyStyle,
    h2: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700',
    } satisfies TypographyStyle,
    h3: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600',
    } satisfies TypographyStyle,
  },
  body: {
    large: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '400',
    } satisfies TypographyStyle,
    medium: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    } satisfies TypographyStyle,
    small: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    } satisfies TypographyStyle,
  },
  label: {
    large: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    } satisfies TypographyStyle,
    medium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
    } satisfies TypographyStyle,
    small: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600',
    } satisfies TypographyStyle,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } satisfies TypographyStyle,
} as const;

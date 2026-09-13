/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Typography Design Tokens
 */

import { TextStyle } from 'react-native';

export const fontFamilies = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
  system: 'System',
};

export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

export const typographyVariants = {
  // Headings
  h1: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: fontWeights.semibold,
    fontFamily: fontFamilies.semibold,
  },
  h2: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.medium,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.medium,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.medium,
  },

  // Body
  title1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeights.semibold,
    fontFamily: fontFamilies.semibold,
  },
  title2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.medium,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: fontWeights.regular,
    fontFamily: fontFamilies.regular,
  },
  helper1: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: fontWeights.semibold,
    fontFamily: fontFamilies.semibold,
  },
  helper2: {
    fontSize: 8,
    lineHeight: 12,
    fontWeight: fontWeights.semibold,
    fontFamily: fontFamilies.semibold,
  },
} as const;

export type TypographyVariant = keyof typeof typographyVariants;

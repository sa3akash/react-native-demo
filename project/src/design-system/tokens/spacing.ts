/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Spacing & Radius Design Tokens
 */

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
};

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;

export type Breakpoint = 'mobile' | 'mobileLarge' | 'tablet' | 'tabletLarge';

export const BREAKPOINTS: Record<Breakpoint, number> = {
  mobile: 0,
  mobileLarge: 380,
  tablet: 600,
  tabletLarge: 1024,
};

export const getBreakpoint = (width: number): Breakpoint => {
  if (width >= BREAKPOINTS.tabletLarge) return 'tabletLarge';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  if (width >= BREAKPOINTS.mobileLarge) return 'mobileLarge';
  return 'mobile';
};

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export const resolveResponsiveValue = <T>(
  value: ResponsiveValue<T>,
  currentBreakpoint: Breakpoint,
): T => {
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }

  const map = value as Partial<Record<Breakpoint, T>>;
  if (currentBreakpoint === 'tabletLarge' && map.tabletLarge !== undefined) {
    return map.tabletLarge;
  }
  if (
    (currentBreakpoint === 'tabletLarge' || currentBreakpoint === 'tablet') &&
    map.tablet !== undefined
  ) {
    return map.tablet;
  }
  if (
    (currentBreakpoint === 'tabletLarge' ||
      currentBreakpoint === 'tablet' ||
      currentBreakpoint === 'mobileLarge') &&
    map.mobileLarge !== undefined
  ) {
    return map.mobileLarge;
  }
  if (map.mobile !== undefined) {
    return map.mobile;
  }

  const fallback = Object.values(map)[0];
  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error('Invalid responsive value supplied with no matching breakpoint fallback.');
};

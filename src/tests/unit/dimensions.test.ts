import { getBreakpoint, resolveResponsiveValue } from '../../theme/dimensions';

describe('Dimensions and Breakpoints', () => {
  it('should identify breakpoint correctly based on window width', () => {
    expect(getBreakpoint(350)).toBe('mobile');
    expect(getBreakpoint(400)).toBe('mobileLarge');
    expect(getBreakpoint(768)).toBe('tablet');
    expect(getBreakpoint(1200)).toBe('tabletLarge');
  });

  it('should resolve responsive values based on current breakpoint', () => {
    const responsiveConfig = {
      mobile: 12,
      tablet: 24,
      tabletLarge: 32,
    };

    expect(resolveResponsiveValue(responsiveConfig, 'mobile')).toBe(12);
    expect(resolveResponsiveValue(responsiveConfig, 'tablet')).toBe(24);
    expect(resolveResponsiveValue(responsiveConfig, 'tabletLarge')).toBe(32);
  });
});

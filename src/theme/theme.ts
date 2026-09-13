import { ColorPalette, darkColors, lightColors } from './colors';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

export interface Theme {
  readonly isDark: boolean;
  readonly colors: ColorPalette;
  readonly spacing: typeof spacing;
  readonly typography: typeof typography;
  readonly radius: typeof radius;
  readonly shadows: typeof shadows;
}

export const createTheme = (isDark: boolean): Theme => ({
  isDark,
  colors: isDark ? darkColors : lightColors,
  spacing,
  typography,
  radius,
  shadows,
});

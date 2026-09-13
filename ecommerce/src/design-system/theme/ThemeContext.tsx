import React, { createContext, useContext, ReactNode } from "react";
import { useThemeStore, ThemeMode } from "./useThemeStore";
import { ColorPalette } from "../colors/colors";
import { typography } from "../typography/typography";
import { spacing } from "../spacing/spacing";
import { radius } from "../radius/radius";
import { shadows } from "../shadows/shadows";

export interface Theme {
  mode: ThemeMode;
  isDark: boolean;
  colors: ColorPalette;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<Theme | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { themeMode, isDark, colors, setThemeMode } = useThemeStore();

  const themeValue: Theme = {
    mode: themeMode,
    isDark,
    colors,
    typography,
    spacing,
    radius,
    shadows,
    setThemeMode,
  };

  return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Direct store fallback for maximum resilience
    const { themeMode, isDark, colors, setThemeMode } = useThemeStore.getState();
    return {
      mode: themeMode,
      isDark,
      colors,
      typography,
      spacing,
      radius,
      shadows,
      setThemeMode,
    };
  }
  return context;
};

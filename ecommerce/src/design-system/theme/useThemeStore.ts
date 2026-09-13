import { create } from "zustand";
import { Appearance } from "react-native";
import { storageAdapter } from "../../core/storage/storageAdapter";
import { ColorPalette, lightPalette, darkPalette } from "../colors/colors";
import { typography } from "../typography/typography";
import { spacing } from "../spacing/spacing";
import { radius } from "../radius/radius";
import { shadows } from "../shadows/shadows";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "app_theme_mode_preference";

interface ThemeState {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ColorPalette;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  setThemeMode: (mode: ThemeMode) => void;
}

const getInitialThemeMode = (): ThemeMode => {
  const saved = storageAdapter.getString(STORAGE_KEY);
  if (saved === "light" || saved === "dark" || saved === "system") {
    return saved;
  }
  return "system";
};

const resolveIsDark = (mode: ThemeMode): boolean => {
  if (mode === "system") {
    return Appearance.getColorScheme() === "dark";
  }
  return mode === "dark";
};

export const useThemeStore = create<ThemeState>((set, get) => {
  const initialMode = getInitialThemeMode();
  const initialIsDark = resolveIsDark(initialMode);

  // Listen to OS system theme changes dynamically
  Appearance.addChangeListener(({ colorScheme }) => {
    if (get().themeMode === "system") {
      const isDark = colorScheme === "dark";
      set({
        isDark,
        colors: isDark ? darkPalette : lightPalette,
      });
    }
  });

  return {
    themeMode: initialMode,
    isDark: initialIsDark,
    colors: initialIsDark ? darkPalette : lightPalette,
    typography,
    spacing,
    radius,
    shadows,

    setThemeMode: (mode: ThemeMode) => {
      storageAdapter.setString(STORAGE_KEY, mode);
      const isDark = resolveIsDark(mode);
      set({
        themeMode: mode,
        isDark,
        colors: isDark ? darkPalette : lightPalette,
      });
    },
  };
});

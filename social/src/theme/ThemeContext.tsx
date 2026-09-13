import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useColorScheme, Dimensions } from 'react-native';
import { Theme, ThemeMode, ColorPalette } from './types';
import { lightPalette, darkPalette, amoledPalette, materialYouPalette } from './palettes';
import { typography, spacing, radius } from './tokens';
import { getResponsiveMetrics, ResponsiveMetrics } from './responsive';
import { storageService } from '../core/storage/StorageService';
import { eventBus } from '../core/events/EventBus';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  colors: ColorPalette;
  responsive: ResponsiveMetrics;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(() => {
    return storageService.getItem<ThemeMode>('app_theme_mode') || 'system';
  });

  const [responsiveMetrics, setResponsiveMetrics] = useState<ResponsiveMetrics>(() => getResponsiveMetrics());

  // Listen to screen orientation and fold/unfold viewport resizing
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setResponsiveMetrics(getResponsiveMetrics());
    });
    return () => {
      subscription?.remove();
    };
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    storageService.setItem('app_theme_mode', newMode);
    eventBus.emit('THEME:CHANGED', { mode: newMode });
  };

  const activeTheme = useMemo<Theme>(() => {
    let resolvedIsDark = false;
    let palette: ColorPalette = lightPalette;

    if (mode === 'system') {
      resolvedIsDark = systemColorScheme === 'dark';
      palette = resolvedIsDark ? darkPalette : lightPalette;
    } else if (mode === 'dark') {
      resolvedIsDark = true;
      palette = darkPalette;
    } else if (mode === 'amoled') {
      resolvedIsDark = true;
      palette = amoledPalette;
    } else if (mode === 'materialYou') {
      resolvedIsDark = false;
      palette = materialYouPalette;
    } else if (mode === 'light') {
      resolvedIsDark = false;
      palette = lightPalette;
    }

    return {
      mode,
      isDark: resolvedIsDark,
      colors: palette,
      spacing,
      radius,
      typography,
      responsive: responsiveMetrics,
    };
  }, [mode, systemColorScheme, responsiveMetrics]);

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        mode,
        setMode,
        isDark: activeTheme.isDark,
        colors: activeTheme.colors,
        responsive: responsiveMetrics,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

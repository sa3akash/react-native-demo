import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeMode } from '../types';
import { createTheme, Theme } from './theme';

interface ThemeContextValue {
  readonly theme: Theme;
  readonly mode: ThemeMode;
  readonly setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  readonly mode: ThemeMode;
  readonly onModeChange: (mode: ThemeMode) => void;
  readonly children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ mode, onModeChange, children }) => {
  const systemColorScheme = useColorScheme();

  const activeIsDark = useMemo(() => {
    if (mode === 'system') {
      return systemColorScheme === 'dark';
    }
    return mode === 'dark';
  }, [mode, systemColorScheme]);

  const theme = useMemo(() => createTheme(activeIsDark), [activeIsDark]);

  const value = useMemo(
    () => ({
      theme,
      mode,
      setMode: onModeChange,
    }),
    [theme, mode, onModeChange],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

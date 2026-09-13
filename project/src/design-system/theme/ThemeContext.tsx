/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Advanced Theme Provider with System Theme Support, Responsive Layouts & Memory Leak Safety
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { colors } from '../tokens/colors';
import { typographyVariants } from '../tokens/typography';
import { lightShadows, darkShadows } from '../tokens/shadows';
import { spacing, radius } from '../tokens/spacing';
import {
  scale,
  verticalScale,
  moderateScale,
  responsiveFontSize,
} from '../utils/responsive';
import {
  Theme,
  ThemeColors,
  ThemeContextType,
  ThemeMode,
  ActiveThemeMode,
  ResponsiveUtils,
} from './types';

const lightColors: ThemeColors = {
  background: colors.greyscale['5'],
  surface: colors.greyscale['0'],
  surfaceSecondary: colors.greyscale['15'],
  border: colors.greyscale['50'],

  textPrimary: colors.greyscale['200'],
  textSecondary: colors.greyscale['100'],
  textMuted: colors.greyscale['75'],
  textDisabled: colors.greyscale['50'],
  textInverse: colors.greyscale['0'],

  primary: colors.primary['100'],
  primaryHover: colors.primary['90'],
  primaryLight: colors.primary['0'],
  primaryDark: colors.primary['200'],

  secondary: colors.secondary['100'],
  secondaryLight: colors.secondary['0'],

  success: colors.success['100'],
  successLight: colors.success['10'],

  error: colors.error['100'],
  errorLight: colors.error['10'],

  warning: colors.warning['100'],
  warningLight: colors.warning['10'],

  raw: colors,
};

const darkColors: ThemeColors = {
  background: colors.greyscale['200'],
  surface: colors.greyscale['150'],
  surfaceSecondary: colors.greyscale['100'],
  border: colors.greyscale['100'],

  textPrimary: colors.greyscale['0'],
  textSecondary: colors.greyscale['30'],
  textMuted: colors.greyscale['75'],
  textDisabled: colors.greyscale['100'],
  textInverse: colors.greyscale['200'],

  primary: colors.primary['90'],
  primaryHover: colors.primary['75'],
  primaryLight: 'rgba(255, 106, 39, 0.15)',
  primaryDark: colors.primary['200'],

  secondary: colors.secondary['90'],
  secondaryLight: 'rgba(44, 179, 126, 0.15)',

  success: colors.success['90'],
  successLight: 'rgba(53, 175, 50, 0.15)',

  error: colors.error['90'],
  errorLight: 'rgba(204, 79, 79, 0.15)',

  warning: colors.warning['90'],
  warningLight: 'rgba(240, 183, 38, 0.15)',

  raw: colors,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialMode = 'system',
}) => {
  const systemColorScheme = useColorScheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [modePreference, setModePreference] = useState<ThemeMode>(initialMode);

  // Compute active theme mode
  const activeMode: ActiveThemeMode = useMemo(() => {
    if (modePreference === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return modePreference;
  }, [modePreference, systemColorScheme]);

  // Responsive utilities object
  const responsive: ResponsiveUtils = useMemo(
    () => ({
      scale,
      verticalScale,
      moderateScale,
      responsiveFontSize,
      screenWidth,
      screenHeight,
      isTablet: screenWidth >= 768,
      isSmallDevice: screenWidth < 360,
    }),
    [screenWidth, screenHeight]
  );

  // Memoize main Theme object to avoid memory churn and unnecessary component re-renders
  const theme: Theme = useMemo(
    () => ({
      mode: activeMode,
      userPreference: modePreference,
      colors: activeMode === 'dark' ? darkColors : lightColors,
      shadows: activeMode === 'dark' ? darkShadows : lightShadows,
      typography: typographyVariants,
      spacing,
      radius,
      responsive,
    }),
    [activeMode, modePreference, responsive]
  );

  const setMode = useCallback((newMode: ThemeMode) => {
    setModePreference(newMode);
  }, []);

  const toggleTheme = useCallback(() => {
    setModePreference((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  const contextValue: ThemeContextType = useMemo(
    () => ({
      theme,
      mode: modePreference,
      activeMode,
      isDark: activeMode === 'dark',
      isSystem: modePreference === 'system',
      setMode,
      toggleTheme,
    }),
    [theme, modePreference, activeMode, setMode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useColors = (): ThemeColors => useTheme().theme.colors;
export const useTypography = () => useTheme().theme.typography;
export const useShadows = () => useTheme().theme.shadows;
export const useResponsive = (): ResponsiveUtils => useTheme().theme.responsive;

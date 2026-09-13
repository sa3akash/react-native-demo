/**
 * GoSeat Navigation System - Provider & Root Navigation Container
 * Integrated with GoSeat Design System Theme.
 */

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../design-system/theme/ThemeContext';
import { navigationRef } from './config/navigationRef';
import { RootNavigator } from './navigators/RootNavigator';

export * from './types';
export * from './hooks';
export * from './config/navigationRef';

export const AppNavigationContainer: React.FC = () => {
  const { theme, isDark } = useTheme();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      primary: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

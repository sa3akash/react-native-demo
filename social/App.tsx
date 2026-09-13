import React from 'react';
import { StatusBar } from 'react-native';
import { AppProviders } from './src/app/AppProviders';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useTheme } from './src/theme/ThemeContext';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

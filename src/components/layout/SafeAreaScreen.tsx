import React from 'react';
import { StatusBar, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';

export interface SafeAreaScreenProps extends SafeAreaViewProps {
  readonly children: React.ReactNode;
  readonly style?: ViewStyle;
}

export const SafeAreaScreen: React.FC<SafeAreaScreenProps> = ({ children, style, ...rest }) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.colors.background.primary }, style]}
      {...rest}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background.primary}
      />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

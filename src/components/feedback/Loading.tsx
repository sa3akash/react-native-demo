import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../typography/Text';

export interface LoadingProps {
  readonly message?: string;
  readonly fullScreen?: boolean;
  readonly style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  fullScreen = false,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        fullScreen && [styles.fullScreen, { backgroundColor: theme.colors.background.primary }],
        style,
      ]}>
      <ActivityIndicator size="large" color={theme.colors.brand.primary} />
      {message && (
        <Text size={14} color={theme.colors.text.secondary} style={styles.text}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  text: {
    marginTop: 12,
  },
});

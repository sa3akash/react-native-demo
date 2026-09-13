import React, { memo } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const ErrorStateComponent: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while loading your data.',
  errorCode,
  onRetry,
  retryLabel = 'Try Again',
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]} accessible={true} accessibilityRole="alert">
      <Typography variant="h1" style={styles.icon}>
        ⚠️
      </Typography>

      <Typography variant="h3" color={colors.text} bold style={styles.title}>
        {title}
      </Typography>

      <Typography
        variant="body2"
        color={colors.textSecondary}
        align="center"
        style={styles.message}
      >
        {message}
      </Typography>

      {errorCode && (
        <Typography variant="caption" color={colors.textMuted} style={styles.code}>
          Error code: {errorCode}
        </Typography>
      )}

      {onRetry && (
        <View style={styles.btnWrap}>
          <Button label={retryLabel} onPress={onRetry} variant="primary" size="md" />
        </View>
      )}
    </View>
  );
};

export const ErrorState = memo(ErrorStateComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: 220,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    marginBottom: 16,
    maxWidth: 280,
  },
  code: {
    marginBottom: 16,
  },
  btnWrap: {
    minWidth: 140,
  },
});

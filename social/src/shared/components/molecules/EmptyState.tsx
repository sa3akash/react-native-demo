import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

const EmptyStateComponent: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]} accessible={true} accessibilityRole="none">
      <Typography variant="h1" style={styles.icon}>
        {icon}
      </Typography>
      <Typography variant="h4" color={colors.text} bold style={styles.title}>
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          color={colors.textSecondary}
          align="center"
          style={styles.description}
        >
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <View style={styles.btnWrapper}>
          <Button label={actionLabel} onPress={onAction} size="md" />
        </View>
      )}
    </View>
  );
};

export const EmptyState = memo(EmptyStateComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    maxWidth: 280,
    marginBottom: 20,
  },
  btnWrapper: {
    minWidth: 140,
  },
});

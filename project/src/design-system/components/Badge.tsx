/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Badge / Pill Component - Zero Inline Styles & High Performance
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'neutral';

export type BadgeSize = 'small' | 'medium' | 'large';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: IconName;
  outlined?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  icon,
  outlined = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const colors = useMemo(() => {
    switch (variant) {
      case 'primary':
        return {
          bg: outlined ? 'transparent' : theme.colors.primaryLight,
          text: theme.colors.primary,
          border: theme.colors.primary,
        };
      case 'secondary':
        return {
          bg: outlined ? 'transparent' : theme.colors.secondaryLight,
          text: theme.colors.secondary,
          border: theme.colors.secondary,
        };
      case 'success':
        return {
          bg: outlined ? 'transparent' : theme.colors.successLight,
          text: theme.colors.success,
          border: theme.colors.success,
        };
      case 'error':
        return {
          bg: outlined ? 'transparent' : theme.colors.errorLight,
          text: theme.colors.error,
          border: theme.colors.error,
        };
      case 'warning':
        return {
          bg: outlined ? 'transparent' : theme.colors.warningLight,
          text: theme.colors.warning,
          border: theme.colors.warning,
        };
      case 'neutral':
      default:
        return {
          bg: outlined ? 'transparent' : theme.colors.surfaceSecondary,
          text: theme.colors.textSecondary,
          border: theme.colors.border,
        };
    }
  }, [variant, outlined, theme.colors]);

  const specs = useMemo(() => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 2,
          paddingHorizontal: theme.spacing.xs,
          textVariant: 'helper2' as const,
          iconSize: 10,
          borderRadius: theme.radius.xs,
        };
      case 'large':
        return {
          paddingVertical: 6,
          paddingHorizontal: theme.spacing.md,
          textVariant: 'title2' as const,
          iconSize: 16,
          borderRadius: theme.radius.md,
        };
      case 'medium':
      default:
        return {
          paddingVertical: 4,
          paddingHorizontal: theme.spacing.sm,
          textVariant: 'helper1' as const,
          iconSize: 12,
          borderRadius: theme.radius.sm,
        };
    }
  }, [size, theme.spacing, theme.radius]);

  const computedBadgeStyle = useMemo<ViewStyle>(
    () => ({
      backgroundColor: colors.bg,
      borderColor: colors.border,
      borderWidth: outlined ? 1 : 0,
      paddingVertical: specs.paddingVertical,
      paddingHorizontal: specs.paddingHorizontal,
      borderRadius: specs.borderRadius,
    }),
    [colors, outlined, specs]
  );

  return (
    <View style={[styles.badge, computedBadgeStyle, style]}>
      {icon && (
        <Icon
          name={icon}
          size={specs.iconSize}
          color={colors.text}
          style={styles.iconMargin}
        />
      )}
      <Text
        variant={specs.textVariant}
        color={colors.text}
        weight="semibold"
        style={textStyle}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  iconMargin: {
    marginRight: 4,
  },
});

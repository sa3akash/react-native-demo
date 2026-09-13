import React, { memo } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from './Typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'surface';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  style,
  ...rest
}) => {
  const { colors, theme } = useTheme();

  let bgColor = colors.primary;
  let textColor = colors.textInverse;
  let borderColor = 'transparent';
  let borderWidth = 0;

  if (variant === 'secondary') {
    bgColor = colors.primaryLight;
    textColor = colors.primary;
  } else if (variant === 'outline') {
    bgColor = 'transparent';
    textColor = colors.primary;
    borderColor = colors.border;
    borderWidth = 1;
  } else if (variant === 'ghost') {
    bgColor = 'transparent';
    textColor = colors.text;
  } else if (variant === 'danger') {
    bgColor = colors.danger;
    textColor = '#FFFFFF';
  } else if (variant === 'surface') {
    bgColor = colors.surfaceElevated;
    textColor = colors.text;
  }

  let paddingVertical = theme.spacing.sm;
  let paddingHorizontal = theme.spacing.lg;
  let textVariant: 'buttonSmall' | 'buttonMedium' | 'buttonLarge' = 'buttonMedium';

  if (size === 'sm') {
    paddingVertical = theme.spacing.xs + 2;
    paddingHorizontal = theme.spacing.md;
    textVariant = 'buttonSmall';
  } else if (size === 'lg') {
    paddingVertical = theme.spacing.md;
    paddingHorizontal = theme.spacing.xl;
    textVariant = 'buttonLarge';
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: bgColor,
          borderColor,
          borderWidth,
          paddingVertical,
          paddingHorizontal,
          borderRadius: theme.radius.md,
          alignSelf: fullWidth ? 'stretch' : 'auto',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Typography variant={textVariant} color={textColor} bold>
            {label}
          </Typography>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const Button = memo(ButtonComponent);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

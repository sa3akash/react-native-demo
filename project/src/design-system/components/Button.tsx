/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Button Component - Zero Inline Styles & High Performance
 */

import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const containerStyle = useMemo<ViewStyle>(() => {
    let backgroundColor = theme.colors.primary;
    let borderColor = 'transparent';
    let borderWidth = 0;

    switch (variant) {
      case 'primary':
        backgroundColor = disabled
          ? theme.colors.textDisabled
          : theme.colors.primary;
        break;
      case 'secondary':
        backgroundColor = disabled
          ? theme.colors.textDisabled
          : theme.colors.secondary;
        break;
      case 'outline':
        backgroundColor = 'transparent';
        borderColor = disabled
          ? theme.colors.textDisabled
          : theme.colors.primary;
        borderWidth = 1.5;
        break;
      case 'ghost':
        backgroundColor = 'transparent';
        break;
      case 'danger':
        backgroundColor = disabled
          ? theme.colors.textDisabled
          : theme.colors.error;
        break;
      case 'success':
        backgroundColor = disabled
          ? theme.colors.textDisabled
          : theme.colors.success;
        break;
      case 'warning':
        backgroundColor = disabled
          ? theme.colors.textDisabled
          : theme.colors.warning;
        break;
    }

    let height = theme.responsive.verticalScale(44);
    let paddingHorizontal = theme.spacing.lg;
    let borderRadius = theme.radius.md;

    if (size === 'small') {
      height = theme.responsive.verticalScale(34);
      paddingHorizontal = theme.spacing.md;
      borderRadius = theme.radius.sm;
    } else if (size === 'large') {
      height = theme.responsive.verticalScale(54);
      paddingHorizontal = theme.spacing.xxl;
      borderRadius = theme.radius.lg;
    }

    return {
      backgroundColor,
      borderColor,
      borderWidth,
      height,
      paddingHorizontal,
      borderRadius,
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
      opacity: disabled && variant === 'ghost' ? 0.5 : 1,
    };
  }, [variant, size, disabled, fullWidth, theme]);

  const textColor = useMemo<string>(() => {
    if (disabled) {
      return variant === 'ghost' || variant === 'outline'
        ? theme.colors.textDisabled
        : theme.colors.surface;
    }

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'success':
        return theme.colors.raw.greyscale['0'];
      case 'warning':
        return theme.colors.raw.greyscale['200'];
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
    }
  }, [variant, disabled, theme.colors]);

  const textVariant = useMemo(() => {
    if (size === 'small') return 'title2';
    if (size === 'large') return 'title1';
    return 'title2';
  }, [size]);

  const iconSize = useMemo(() => {
    return size === 'small' ? 16 : size === 'large' ? 22 : 18;
  }, [size]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.button, containerStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && (
            <Icon
              name={leftIcon}
              size={iconSize}
              color={textColor}
              style={styles.leftIconMargin}
            />
          )}
          <Text
            variant={textVariant}
            color={textColor}
            weight="semibold"
            style={[styles.text, textStyle]}
          >
            {title}
          </Text>
          {rightIcon && (
            <Icon
              name={rightIcon}
              size={iconSize}
              color={textColor}
              style={styles.rightIconMargin}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  leftIconMargin: {
    marginRight: 6,
  },
  rightIconMargin: {
    marginLeft: 6,
  },
});

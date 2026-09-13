import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../typography/Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  readonly title: string;
  readonly onPress: () => void;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  readonly style?: ViewStyle;
  readonly accessibilityLabel?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getVariantStyles = (): {
    container: ViewStyle;
    textColor: string;
    spinnerColor: string;
  } => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.colors.background.secondary,
            borderColor: 'transparent',
          },
          textColor: theme.colors.text.primary,
          spinnerColor: theme.colors.text.primary,
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: theme.colors.brand.primary,
          },
          textColor: theme.colors.brand.primary,
          spinnerColor: theme.colors.brand.primary,
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
          textColor: theme.colors.brand.primary,
          spinnerColor: theme.colors.brand.primary,
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: theme.colors.brand.primary,
            borderColor: 'transparent',
          },
          textColor: theme.colors.text.inverse,
          spinnerColor: theme.colors.text.inverse,
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; fontSize: number } => {
    switch (size) {
      case 'small':
        return {
          container: {
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.radius.sm,
          },
          fontSize: 14,
        };
      case 'large':
        return {
          container: {
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.xl,
            borderRadius: theme.radius.lg,
          },
          fontSize: 18,
        };
      case 'medium':
      default:
        return {
          container: {
            paddingVertical: theme.spacing.sm + 4,
            paddingHorizontal: theme.spacing.lg,
            borderRadius: theme.radius.md,
          },
          fontSize: 16,
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();
  const isInteractionDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isInteractionDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInteractionDisabled, busy: loading }}
      accessibilityLabel={accessibilityLabel || title}
      style={[
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        fullWidth && styles.fullWidth,
        isInteractionDisabled && { opacity: 0.5 },
        animatedStyle,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variantStyle.spinnerColor} size="small" />
      ) : (
        <Text size={sizeStyle.fontSize} weight="600" color={variantStyle.textColor} align="center">
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
});

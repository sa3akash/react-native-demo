/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Card Container Component - Zero Inline Styles & High Performance
 */

import React, { useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ShadowElevation } from '../tokens/shadows';
import { SpacingToken, RadiusToken } from '../tokens/spacing';

export interface CardProps {
  elevation?: ShadowElevation | 'none';
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: SpacingToken;
  radius?: RadiusToken;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  elevation = 'small',
  variant = 'elevated',
  padding = 'lg',
  radius: cardRadius = 'lg',
  style,
  children,
  onPress,
}) => {
  const { theme } = useTheme();

  const cardStyle = useMemo<ViewStyle>(() => {
    let variantStyle: ViewStyle = {};

    switch (variant) {
      case 'outlined':
        variantStyle = {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 1,
        };
        break;
      case 'flat':
        variantStyle = {
          backgroundColor: theme.colors.surfaceSecondary,
          borderWidth: 0,
        };
        break;
      case 'elevated':
      default:
        variantStyle = {
          backgroundColor: theme.colors.surface,
          borderWidth: 0,
          ...(elevation !== 'none' ? theme.shadows[elevation] : {}),
        };
        break;
    }

    return {
      padding: theme.spacing[padding],
      borderRadius: theme.radius[cardRadius],
      ...variantStyle,
    };
  }, [variant, elevation, padding, cardRadius, theme]);

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};

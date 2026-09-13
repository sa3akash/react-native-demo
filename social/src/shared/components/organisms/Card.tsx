import React, { memo } from 'react';
import { View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'elevated' | 'flat' | 'outlined' | 'glass';
  padding?: number;
}

const CardComponent: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'flat',
  padding,
}) => {
  const { colors, theme } = useTheme();

  const resolvedPadding = padding !== undefined ? padding : theme.spacing.md;

  let bgColor = colors.surface;
  let borderColor = 'transparent';
  let borderWidth = 0;
  let elevation = 0;
  let shadowStyle = {};

  if (variant === 'elevated') {
    bgColor = colors.surfaceElevated;
    elevation = 2;
    shadowStyle = {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    };
  } else if (variant === 'outlined') {
    borderColor = colors.borderSubtle;
    borderWidth = 1;
  } else if (variant === 'glass') {
    bgColor = colors.glassBg;
    borderColor = colors.glassBorder;
    borderWidth = 1;
  }

  const cardStyle: ViewStyle = {
    backgroundColor: bgColor,
    borderColor,
    borderWidth,
    borderRadius: theme.radius.lg,
    padding: resolvedPadding,
    elevation,
    ...shadowStyle,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};

export const Card = memo(CardComponent);

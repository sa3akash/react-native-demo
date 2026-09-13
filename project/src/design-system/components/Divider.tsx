/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Divider Component - Zero Inline Styles & High Performance
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SpacingToken } from '../tokens/spacing';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: number;
  spacing?: SpacingToken;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  color,
  thickness = 1,
  spacing: dividerSpacing = 'md',
  style,
}) => {
  const { theme } = useTheme();

  const computedDividerStyle = useMemo<ViewStyle>(() => {
    const dividerColor = color || theme.colors.border;
    const margin = theme.spacing[dividerSpacing];

    if (orientation === 'vertical') {
      return {
        width: thickness,
        backgroundColor: dividerColor,
        marginHorizontal: margin,
      };
    }

    return {
      height: thickness,
      backgroundColor: dividerColor,
      marginVertical: margin,
    };
  }, [orientation, color, thickness, dividerSpacing, theme]);

  return (
    <View
      style={[
        orientation === 'vertical' ? styles.vertical : styles.horizontal,
        computedDividerStyle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
});

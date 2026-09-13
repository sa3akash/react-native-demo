/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Switch / Toggle Component - Zero Inline Styles & High Performance
 */

import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  style?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  activeColor,
  inactiveColor,
  style,
}) => {
  const { theme } = useTheme();

  const trackActiveColor = activeColor || theme.colors.primary;
  const trackInactiveColor = inactiveColor || theme.colors.border;

  const trackComputedStyle = useMemo<ViewStyle>(
    () => ({
      backgroundColor: value ? trackActiveColor : trackInactiveColor,
      opacity: disabled ? 0.5 : 1,
    }),
    [value, trackActiveColor, trackInactiveColor, disabled]
  );

  const thumbComputedStyle = useMemo<ViewStyle>(
    () => ({
      backgroundColor: theme.colors.surface,
      transform: [{ translateX: value ? 20 : 2 }],
    }),
    [value, theme.colors.surface]
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[styles.track, trackComputedStyle, style]}
    >
      <View style={[styles.thumb, thumbComputedStyle]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 46,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
});

import React from 'react';
import { View, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

export const Divider: React.FC<{
  marginVertical?: number;
  color?: string;
  style?: ViewStyle;
}> = ({ marginVertical = 8, color, style }) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          height: StyleSheet.hairlineWidth,
          backgroundColor: color || colors.divider,
          marginVertical,
          width: '100%',
        },
        style,
      ]}
    />
  );
};

export const Spinner: React.FC<{
  size?: 'small' | 'large';
  color?: string;
}> = ({ size = 'small', color }) => {
  const { colors } = useTheme();
  return <ActivityIndicator size={size} color={color || colors.primary} />;
};

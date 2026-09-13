import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export interface DiscountBadgeProps {
  percentage: number; // e.g. 15 for 15% OFF
  style?: ViewStyle;
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({ percentage, style }) => {
  const { colors, radius, spacing, typography } = useTheme();

  if (percentage <= 0) return null;

  return (
    <View
      style={[
        styles.container,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          backgroundColor: colors.error,
          borderRadius: radius.xs,
          paddingHorizontal: spacing.xs + 2,
          paddingVertical: 2,
        },
        style,
      ]}
    >
      <Text style={[typography.caption, styles.text]}>-{percentage}% OFF</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 11,
  },
});

import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export interface RatingProps {
  rating: number; // e.g. 4.8
  reviewCount?: number;
  showCount?: boolean;
  size?: "sm" | "md";
  style?: ViewStyle;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  reviewCount,
  showCount = true,
  size = "sm",
  style,
}) => {
  const { colors, typography, spacing } = useTheme();

  const starSize = size === "sm" ? 12 : 16;

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.starText, { color: colors.rating, fontSize: starSize }]}>★</Text>
      <Text
        style={[
          size === "sm" ? typography.caption : typography.bodySmall,
          { color: colors.text, fontWeight: "700", marginLeft: spacing.xs },
        ]}
      >
        {rating.toFixed(1)}
      </Text>
      {showCount && reviewCount !== undefined && (
        <Text
          style={[
            typography.caption,
            { color: colors.info, marginLeft: spacing.xs },
          ]}
        >
          ({reviewCount.toLocaleString()})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starText: {
    fontWeight: "bold",
  },
});

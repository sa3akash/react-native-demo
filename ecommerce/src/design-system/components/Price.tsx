import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Money, formatMoney } from "../../domain/pricing/money";
import { useTheme } from "../theme/ThemeContext";

export interface PriceProps {
  price: Money;
  originalPrice?: Money;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
}

export const Price: React.FC<PriceProps> = ({ price, originalPrice, size = "md", style }) => {
  const { colors, typography, spacing } = useTheme();

  const formattedPrice = formatMoney(price);
  const formattedOriginal = originalPrice ? formatMoney(originalPrice) : null;

  const getPriceFontSize = (): TextStyle => {
    switch (size) {
      case "sm":
        return { fontSize: 14, lineHeight: 18, fontWeight: "700" };
      case "lg":
        return { fontSize: 24, lineHeight: 28, fontWeight: "800" };
      default:
        return typography.price;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[getPriceFontSize(), { color: colors.price }]}>{formattedPrice}</Text>
      {formattedOriginal && (
        <Text
          style={[
            typography.caption,
            styles.originalPrice,
            { color: colors.textMuted, marginLeft: spacing.xs },
          ]}
        >
          {formattedOriginal}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  originalPrice: {
    textDecorationLine: "line-through",
  },
});

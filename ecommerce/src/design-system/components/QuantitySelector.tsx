import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export interface QuantitySelectorProps {
  quantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  onQuantityChange: (newQuantity: number) => void;
  style?: ViewStyle;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  minQuantity = 1,
  maxQuantity = 99,
  onQuantityChange,
  style,
}) => {
  const { colors, radius, spacing, typography } = useTheme();

  const handleDecrement = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.border,
          borderRadius: radius.md,
          backgroundColor: colors.surface,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={handleDecrement}
        disabled={quantity <= minQuantity}
        style={[
          styles.button,
          {
            paddingHorizontal: spacing.sm + 4,
            paddingVertical: spacing.xs,
            opacity: quantity <= minQuantity ? 0.4 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <Text style={[typography.h3, { color: colors.text }]}>-</Text>
      </TouchableOpacity>

      <View style={[styles.quantityBox, { paddingHorizontal: spacing.md }]}>
        <Text style={[typography.body, { color: colors.text, fontWeight: "700" }]}>{quantity}</Text>
      </View>

      <TouchableOpacity
        onPress={handleIncrement}
        disabled={quantity >= maxQuantity}
        style={[
          styles.button,
          {
            paddingHorizontal: spacing.sm + 4,
            paddingVertical: spacing.xs,
            opacity: quantity >= maxQuantity ? 0.4 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <Text style={[typography.h3, { color: colors.text }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    alignSelf: "flex-start",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  quantityBox: {
    justifyContent: "center",
    alignItems: "center",
  },
});

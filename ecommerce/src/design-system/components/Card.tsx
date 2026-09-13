import React from "react";
import { View, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: "none" | "sm" | "md" | "lg";
  outlined?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, elevation = "sm", outlined = false }) => {
  const { colors, radius, spacing, shadows } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: outlined ? 1 : 0,
    borderColor: colors.borderSubtle,
    ...(elevation !== "none" ? shadows[elevation] : {}),
  };

  return <View style={[cardStyle, style]}>{children}</View>;
};

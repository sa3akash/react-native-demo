import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "📦",
  title,
  message,
  actionTitle,
  onAction,
  style,
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[typography.h2, { color: colors.text, marginTop: spacing.md, textAlign: "center" }]}>
        {title}
      </Text>
      <Text
        style={[
          typography.body,
          { color: colors.textSecondary, marginTop: spacing.xs, textAlign: "center", marginBottom: spacing.lg },
        ]}
      >
        {message}
      </Text>

      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} variant="primary" size="md" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  icon: {
    fontSize: 56,
  },
});

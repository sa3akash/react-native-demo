import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  style?: ViewStyle;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  onFocus,
  placeholder = "Search Amazon...",
  autoFocus = false,
  style,
}) => {
  const { colors, radius, spacing, typography, shadows } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          borderColor: colors.primary,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs + 2,
        },
        shadows.sm,
        style,
      ]}
    >
      <Text style={[styles.searchIcon, { color: colors.textMuted }]}>🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoFocus={autoFocus}
        returnKeyType="search"
        style={[styles.input, typography.body, { color: colors.text }]}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText("");
            onClear?.();
          }}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear search text"
        >
          <Text style={[styles.clearIcon, { color: colors.textMuted }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    width: "100%",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSubmit?: () => void;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  onSubmit,
  style,
}) => {
  const { colors, theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.inputBg,
          borderColor: isFocused ? colors.primary : colors.inputBorder,
          borderRadius: theme.radius.full,
        },
        style,
      ]}
    >
      <Typography variant="body1" color={colors.textSecondary} style={styles.searchIcon}>
        🔍
      </Typography>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        style={[
          styles.input,
          {
            color: colors.text,
            fontSize: theme.typography.body1.fontSize,
          },
        ]}
      />
      {value.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          style={styles.clearBtn}
        >
          <Typography variant="caption" color={colors.textSecondary} bold>
            ✕
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 6,
  },
});

import React from 'react';
import { Pressable, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../typography/Text';
import { Input, InputProps } from './Input';

export interface SearchInputProps extends Omit<InputProps, 'leftAccessory' | 'rightAccessory'> {
  readonly onClear?: () => void;
}

export const SearchInput = React.forwardRef<RNTextInput, SearchInputProps>(
  ({ value, onClear, onChangeText, ...props }, ref) => {
    const { theme } = useTheme();

    return (
      <Input
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search..."
        leftAccessory={
          <Text size={16} color={theme.colors.text.muted}>
            🔍
          </Text>
        }
        rightAccessory={
          Boolean(value) && (
            <Pressable
              onPress={() => {
                onChangeText?.('');
                onClear?.();
              }}
              style={styles.clearBtn}
              accessibilityRole="button"
              accessibilityLabel="Clear search input">
              <Text size={14} color={theme.colors.text.muted}>
                ✕
              </Text>
            </Pressable>
          )
        }
        {...props}
      />
    );
  },
);

SearchInput.displayName = 'SearchInput';

const styles = StyleSheet.create({
  clearBtn: {
    padding: 4,
  },
});

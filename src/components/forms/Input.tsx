import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../typography/Text';

export interface InputProps extends RNTextInputProps {
  readonly label?: string;
  readonly error?: string;
  readonly hint?: string;
  readonly leftAccessory?: React.ReactNode;
  readonly rightAccessory?: React.ReactNode;
  readonly containerStyle?: ViewStyle;
}

export const Input = React.forwardRef<RNTextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftAccessory,
      rightAccessory,
      containerStyle,
      style,
      editable = true,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const getBorderColor = () => {
      if (error) return theme.colors.status.error;
      if (isFocused) return theme.colors.border.focused;
      return theme.colors.border.default;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text size={14} weight="600" color={theme.colors.text.primary} style={styles.label}>
            {label}
          </Text>
        )}

        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: editable
                ? theme.colors.background.primary
                : theme.colors.background.secondary,
              borderColor: getBorderColor(),
              borderRadius: theme.radius.md,
            },
          ]}>
          {leftAccessory && <View style={styles.accessoryLeft}>{leftAccessory}</View>}

          <RNTextInput
            ref={ref}
            editable={editable}
            placeholderTextColor={theme.colors.text.muted}
            onFocus={e => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            style={[
              styles.input,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.body.medium.fontSize,
              },
              style,
            ]}
            {...rest}
          />

          {rightAccessory && <View style={styles.accessoryRight}>{rightAccessory}</View>}
        </View>

        {error ? (
          <Text size={12} color={theme.colors.status.error} style={styles.helper}>
            {error}
          </Text>
        ) : hint ? (
          <Text size={12} color={theme.colors.text.muted} style={styles.helper}>
            {hint}
          </Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 6,
  },
  label: {
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  accessoryLeft: {
    marginRight: 8,
  },
  accessoryRight: {
    marginLeft: 8,
  },
  helper: {
    marginTop: 4,
  },
});

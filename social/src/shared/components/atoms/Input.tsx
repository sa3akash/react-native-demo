import React, { useState, memo } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from './Typography';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

const InputComponent: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isPassword = false,
  style,
  onFocus,
  onBlur,
  editable = true,
  ...rest
}) => {
  const { colors, theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isRTL = I18nManager.isRTL;

  const hasError = Boolean(error);
  const borderColor = hasError
    ? colors.danger
    : isFocused
    ? colors.primary
    : colors.inputBorder;

  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="subtitle2" color={colors.text} bold style={styles.label}>
          {label}
        </Typography>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBg,
            borderColor,
            borderRadius: theme.radius.md,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            opacity: editable ? 1 : 0.6,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}
        <TextInput
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          editable={editable}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.textInput,
            {
              color: colors.text,
              fontSize: theme.typography.body1.fontSize,
              textAlign: isRTL ? 'right' : 'left',
            },
            style,
          ]}
          accessible={true}
          accessibilityLabel={label || 'Text input'}
          accessibilityRole="none"
          accessibilityState={{ disabled: !editable }}
          {...rest}
        />
        {isPassword ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIconWrapper}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Typography variant="caption" color={colors.primary} bold>
              {showPassword ? 'HIDE' : 'SHOW'}
            </Typography>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIconWrapper}>{rightIcon}</View>
        ) : null}
      </View>
      {hasError ? (
        <Typography variant="caption" color={colors.danger} style={styles.helper}>
          {error}
        </Typography>
      ) : helperText ? (
        <Typography variant="caption" color={colors.textMuted} style={styles.helper}>
          {helperText}
        </Typography>
      ) : null}
    </View>
  );
};

export const Input = memo(InputComponent);

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  inputWrapper: {
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  leftIconWrapper: {
    marginRight: 6,
  },
  rightIconWrapper: {
    marginLeft: 6,
  },
  helper: {
    marginTop: 4,
    marginLeft: 4,
  },
});

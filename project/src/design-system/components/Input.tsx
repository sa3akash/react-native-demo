/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Input / TextField Component - Zero Inline Styles & High Performance
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

export type InputStatus = 'default' | 'error' | 'success' | 'warning';

export interface InputProps extends RNTextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  status?: InputStatus;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  status = 'default',
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  isPassword = false,
  secureTextEntry,
  value,
  onChangeText,
  placeholder,
  editable = true,
  onFocus,
  onBlur,
  ...rest
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const activeStatus = error ? 'error' : status;

  const borderColor = useMemo(() => {
    if (!editable) return theme.colors.border;
    if (activeStatus === 'error') return theme.colors.error;
    if (activeStatus === 'success') return theme.colors.success;
    if (activeStatus === 'warning') return theme.colors.warning;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  }, [editable, activeStatus, isFocused, theme.colors]);

  const backgroundColor = useMemo(() => {
    if (!editable) return theme.colors.surfaceSecondary;
    return theme.colors.surface;
  }, [editable, theme.colors]);

  const inputContainerStyle = useMemo<ViewStyle>(
    () => ({
      borderColor,
      backgroundColor,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      height: theme.responsive.verticalScale(48),
    }),
    [borderColor, backgroundColor, theme.radius, theme.spacing, theme.responsive]
  );

  const inputTextColor = useMemo(
    () => (editable ? theme.colors.textPrimary : theme.colors.textDisabled),
    [editable, theme.colors]
  );

  const helperTextColor = useMemo(() => {
    if (error) return theme.colors.error;
    if (activeStatus === 'success') return theme.colors.success;
    if (activeStatus === 'warning') return theme.colors.warning;
    return theme.colors.textSecondary;
  }, [error, activeStatus, theme.colors]);

  const effectiveSecureTextEntry = isPassword
    ? !showPassword
    : secureTextEntry;

  const displayRightIcon = isPassword
    ? showPassword
      ? 'close'
      : 'search'
    : rightIcon;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text
          variant="title2"
          color={theme.colors.textPrimary}
          weight="semibold"
          style={styles.label}
        >
          {label}
        </Text>
      )}

      <View style={[styles.inputContainer, inputContainerStyle]}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={
              isFocused ? theme.colors.primary : theme.colors.textMuted
            }
            style={styles.leftIcon}
          />
        )}

        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          editable={editable}
          secureTextEntry={effectiveSecureTextEntry}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus && onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          style={[
            styles.input,
            theme.typography.paragraph,
            { color: inputTextColor },
            inputStyle,
          ]}
          {...rest}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={styles.hitSlop}
            style={styles.rightIconContainer}
          >
            <Text
              variant="helper1"
              color={theme.colors.primary}
              weight="semibold"
            >
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        ) : displayRightIcon ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIconContainer}
          >
            <Icon
              name={displayRightIcon}
              size={20}
              color={
                activeStatus === 'error'
                  ? theme.colors.error
                  : activeStatus === 'success'
                  ? theme.colors.success
                  : theme.colors.textMuted
              }
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {(error || helperText) && (
        <Text
          variant="helper1"
          color={helperTextColor}
          style={styles.helperText}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIconContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    marginTop: 4,
    marginLeft: 2,
  },
  hitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
});

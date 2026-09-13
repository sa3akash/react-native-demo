import React, { useState, memo } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from './Typography';

export interface TextAreaProps extends Omit<TextInputProps, 'multiline'> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
  minHeight?: number;
}

const TextAreaComponent: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  maxLength,
  showCharCount = true,
  minHeight = 100,
  value,
  onChangeText,
  style,
  editable = true,
  ...rest
}) => {
  const { colors, theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const isRTL = I18nManager.isRTL;

  const currentLength = value ? value.length : 0;
  const isOverLimit = maxLength ? currentLength > maxLength : false;

  let borderColor = colors.inputBorder;
  if (isFocused) borderColor = colors.primary;
  if (error || isOverLimit) borderColor = colors.danger;

  return (
    <View style={styles.container}>
      {label && (
        <Typography
          variant="subtitle2"
          color={error ? colors.danger : colors.text}
          bold
          style={styles.label}
          accessibilityRole="text"
        >
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
            minHeight,
            opacity: editable ? 1 : 0.6,
          },
        ]}
      >
        <TextInput
          multiline
          textAlignVertical="top"
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            {
              color: colors.text,
              textAlign: isRTL ? 'right' : 'left',
            },
            style,
          ]}
          accessible={true}
          accessibilityLabel={label || 'Text area input'}
          accessibilityRole="none"
          accessibilityState={{ disabled: !editable }}
          {...rest}
        />
      </View>

      <View style={[styles.footerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.helperCol}>
          {error ? (
            <Typography variant="caption" color={colors.danger}>
              {error}
            </Typography>
          ) : helperText ? (
            <Typography variant="caption" color={colors.textSecondary}>
              {helperText}
            </Typography>
          ) : null}
        </View>

        {showCharCount && maxLength && (
          <Typography
            variant="caption"
            color={isOverLimit ? colors.danger : colors.textMuted}
          >
            {currentLength} / {maxLength}
          </Typography>
        )}
      </View>
    </View>
  );
};

export const TextArea = memo(TextAreaComponent);

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  inputWrapper: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    fontSize: 15,
    padding: 0,
    margin: 0,
  },
  footerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  helperCol: {
    flex: 1,
  },
});

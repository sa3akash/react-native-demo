import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../typography/Text';

export interface CheckboxProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly label?: string;
  readonly disabled?: boolean;
  readonly style?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      style={[styles.container, disabled && { opacity: 0.5 }, style]}>
      <View
        style={[
          styles.box,
          {
            borderColor: checked ? theme.colors.brand.primary : theme.colors.border.default,
            backgroundColor: checked ? theme.colors.brand.primary : 'transparent',
            borderRadius: theme.radius.xs,
          },
        ]}>
        {checked && (
          <Text size={12} weight="700" color={theme.colors.text.inverse}>
            ✓
          </Text>
        )}
      </View>
      {label && (
        <Text size={14} color={theme.colors.text.primary} style={styles.label}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginLeft: 8,
  },
});

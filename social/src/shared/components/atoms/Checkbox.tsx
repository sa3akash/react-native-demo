import React, { memo } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from './Typography';

export interface CheckboxProps {
  checked: boolean;
  onPress?: (nextChecked: boolean) => void;
  onChange?: (nextChecked: boolean) => void;
  onValueChange?: (nextChecked: boolean) => void;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CheckboxComponent: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  onChange,
  onValueChange,
  label,
  sublabel,
  disabled = false,
  size = 'md',
}) => {
  const { colors, theme } = useTheme();
  const isRTL = I18nManager.isRTL;

  const handleToggle = () => {
    const nextVal = !checked;
    onPress?.(nextVal);
    onChange?.(nextVal);
    onValueChange?.(nextVal);
  };

  let boxSize = 22;
  let checkFontSize = 13;
  if (size === 'sm') {
    boxSize = 18;
    checkFontSize = 11;
  } else if (size === 'lg') {
    boxSize = 26;
    checkFontSize = 16;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={handleToggle}
      style={[
        styles.container,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      accessible={true}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label || 'Checkbox'}
    >
      <View
        style={[
          styles.box,
          {
            width: boxSize,
            height: boxSize,
            borderRadius: theme.radius.xs + 2,
            borderColor: checked ? colors.primary : colors.inputBorder,
            backgroundColor: checked ? colors.primary : colors.surface,
          },
        ]}
      >
        {checked && (
          <Typography
            variant="caption"
            color="#FFFFFF"
            bold
            style={{ fontSize: checkFontSize, lineHeight: checkFontSize + 2 }}
          >
            ✓
          </Typography>
        )}
      </View>

      {(label || sublabel) && (
        <View style={[styles.textCol, isRTL ? { marginRight: 10 } : { marginLeft: 10 }]}>
          {label && (
            <Typography variant={size === 'sm' ? 'body2' : 'body1'} color={colors.text} bold={checked}>
              {label}
            </Typography>
          )}
          {sublabel && (
            <Typography variant="caption" color={colors.textSecondary}>
              {sublabel}
            </Typography>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const Checkbox = memo(CheckboxComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 6,
  },
  box: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
  },
});

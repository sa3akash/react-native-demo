import React, { memo } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from './Typography';

export interface RadioOption {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

export interface RadioProps {
  selected: boolean;
  onPress: () => void;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RadioComponent: React.FC<RadioProps> = ({
  selected,
  onPress,
  label,
  sublabel,
  disabled = false,
  size = 'md',
}) => {
  const { colors, theme } = useTheme();
  const isRTL = I18nManager.isRTL;

  let outerSize = 22;
  let innerSize = 10;
  if (size === 'sm') {
    outerSize = 18;
    innerSize = 8;
  } else if (size === 'lg') {
    outerSize = 26;
    innerSize = 12;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.container,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      accessible={true}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label || 'Radio button'}
    >
      <View
        style={[
          styles.outerCircle,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: theme.radius.full,
            borderColor: selected ? colors.primary : colors.inputBorder,
          },
        ]}
      >
        {selected && (
          <View
            style={[
              styles.innerDot,
              {
                width: innerSize,
                height: innerSize,
                borderRadius: theme.radius.full,
                backgroundColor: colors.primary,
              },
            ]}
          />
        )}
      </View>

      {(label || sublabel) && (
        <View style={[styles.textCol, isRTL ? { marginRight: 10 } : { marginLeft: 10 }]}>
          {label && (
            <Typography variant={size === 'sm' ? 'body2' : 'body1'} color={colors.text} bold={selected}>
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

export const Radio = memo(RadioComponent);

export interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  selectedValue,
  onSelect,
  size = 'md',
}) => {
  return (
    <View style={styles.groupContainer} accessibilityRole="radiogroup">
      {options.map((opt) => (
        <Radio
          key={opt.value}
          selected={selectedValue === opt.value}
          onPress={() => onSelect(opt.value)}
          label={opt.label}
          sublabel={opt.sublabel}
          disabled={opt.disabled}
          size={size}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 6,
  },
  outerCircle: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {},
  textCol: {
    flex: 1,
  },
  groupContainer: {
    marginVertical: 4,
  },
});

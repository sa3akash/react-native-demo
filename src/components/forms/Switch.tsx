import React from 'react';
import { Switch as RNSwitch, SwitchProps as RNSwitchProps, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../typography/Text';

export interface SwitchProps extends RNSwitchProps {
  readonly label?: string;
  readonly containerStyle?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  value,
  onValueChange,
  containerStyle,
  disabled,
  ...rest
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 6,
        },
        containerStyle,
      ]}>
      {label && (
        <Text size={16} color={theme.colors.text.primary}>
          {label}
        </Text>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: theme.colors.border.default,
          true: theme.colors.brand.primary,
        }}
        thumbColor={theme.colors.background.primary}
        {...rest}
      />
    </View>
  );
};

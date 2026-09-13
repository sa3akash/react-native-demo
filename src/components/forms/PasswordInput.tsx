import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../typography/Text';
import { Input, InputProps } from './Input';

export type PasswordInputProps = Omit<InputProps, 'secureTextEntry' | 'rightAccessory'>;

export const PasswordInput = React.forwardRef<RNTextInput, PasswordInputProps>((props, ref) => {
  const { theme } = useTheme();
  const [secureText, setSecureText] = useState(true);

  const toggleSecure = () => setSecureText(prev => !prev);

  return (
    <Input
      ref={ref}
      secureTextEntry={secureText}
      autoCapitalize="none"
      autoCorrect={false}
      rightAccessory={
        <Pressable
          onPress={toggleSecure}
          style={styles.toggle}
          accessibilityRole="button"
          accessibilityLabel="Toggle password visibility">
          <Text size={12} weight="600" color={theme.colors.brand.primary}>
            {secureText ? 'SHOW' : 'HIDE'}
          </Text>
        </Pressable>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

const styles = StyleSheet.create({
  toggle: {
    padding: 4,
  },
});

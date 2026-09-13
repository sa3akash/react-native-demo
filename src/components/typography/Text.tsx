import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export interface TextProps extends RNTextProps {
  readonly color?: string;
  readonly size?: number;
  readonly weight?: TextStyle['fontWeight'];
  readonly align?: TextStyle['textAlign'];
  readonly children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  color,
  size,
  weight,
  align,
  style,
  children,
  accessibilityRole = 'text',
  ...rest
}) => {
  const { theme } = useTheme();

  const textStyle: TextStyle = {
    color: color || theme.colors.text.primary,
    fontSize: size || theme.typography.body.medium.fontSize,
    lineHeight: size ? size * 1.4 : theme.typography.body.medium.lineHeight,
    fontWeight: weight || theme.typography.body.medium.fontWeight,
    textAlign: align,
  };

  return (
    <RNText style={[textStyle, style]} accessibilityRole={accessibilityRole} {...rest}>
      {children}
    </RNText>
  );
};

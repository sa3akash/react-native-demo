import React, { memo } from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { TypographyScale } from '../../../theme/types';

export interface TypographyProps extends TextProps {
  variant?: keyof TypographyScale;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  bold?: boolean;
  children: React.ReactNode;
}

const TypographyComponent: React.FC<TypographyProps> = ({
  variant = 'body1',
  color,
  align = 'auto',
  bold,
  style,
  children,
  ...rest
}) => {
  const { theme, colors } = useTheme();
  const token = theme.typography[variant] || theme.typography.body1;

  const resolvedColor = color || colors.text;

  return (
    <Text
      style={[
        {
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          fontWeight: bold ? '700' : token.fontWeight,
          letterSpacing: token.letterSpacing,
          color: resolvedColor,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export const Typography = memo(TypographyComponent);

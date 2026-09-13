import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Text, TextProps } from './Text';

export interface BodyTextProps extends Omit<TextProps, 'size'> {
  readonly size?: 'small' | 'medium' | 'large';
}

export const BodyText: React.FC<BodyTextProps> = ({ size = 'medium', children, ...rest }) => {
  const { theme } = useTheme();
  const bodyStyle = theme.typography.body[size];

  return (
    <Text
      size={bodyStyle.fontSize}
      weight={bodyStyle.fontWeight}
      color={theme.colors.text.primary}
      {...rest}>
      {children}
    </Text>
  );
};

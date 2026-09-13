import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Text, TextProps } from './Text';

export interface HeadingProps extends Omit<TextProps, 'size' | 'weight'> {
  readonly level?: 'h1' | 'h2' | 'h3';
}

export const Heading: React.FC<HeadingProps> = ({ level = 'h1', style, children, ...rest }) => {
  const { theme } = useTheme();
  const headingStyle = theme.typography.heading[level];

  return (
    <Text
      size={headingStyle.fontSize}
      weight={headingStyle.fontWeight}
      color={theme.colors.text.primary}
      accessibilityRole="header"
      style={[headingStyle, style]}
      {...rest}>
      {children}
    </Text>
  );
};

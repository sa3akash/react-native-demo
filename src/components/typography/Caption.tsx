import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Text, TextProps } from './Text';

export const Caption: React.FC<TextProps> = ({ children, ...rest }) => {
  const { theme } = useTheme();
  const captionStyle = theme.typography.caption;

  return (
    <Text
      size={captionStyle.fontSize}
      weight={captionStyle.fontWeight}
      color={theme.colors.text.muted}
      {...rest}>
      {children}
    </Text>
  );
};

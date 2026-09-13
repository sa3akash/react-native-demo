/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Typography Component - Zero Inline Styles, Responsive Scaling & High Performance
 */

import React, { useMemo } from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { TypographyVariant } from '../tokens/typography';
import { fontFamilies, fontWeights } from '../tokens/typography';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  weight?: keyof typeof fontWeights;
  align?: TextStyle['textAlign'];
  children?: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'paragraph',
  color,
  weight,
  align = 'left',
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();

  const computedTextStyle = useMemo<TextStyle>(() => {
    const variantStyle = theme.typography[variant] || theme.typography.paragraph;
    const textColor = color || theme.colors.textPrimary;

    const responsiveFontSize = theme.responsive.responsiveFontSize(variantStyle.fontSize);
    const responsiveLineHeight = Math.round(responsiveFontSize * 1.25);

    const customWeightStyle: TextStyle = weight
      ? {
          fontWeight: fontWeights[weight],
          fontFamily:
            weight === 'semibold'
              ? fontFamilies.semibold
              : weight === 'medium'
              ? fontFamilies.medium
              : fontFamilies.regular,
        }
      : {};

    return {
      ...variantStyle,
      fontSize: responsiveFontSize,
      lineHeight: responsiveLineHeight,
      color: textColor,
      textAlign: align,
      ...customWeightStyle,
    };
  }, [variant, color, weight, align, theme]);

  return (
    <RNText style={[styles.base, computedTextStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});

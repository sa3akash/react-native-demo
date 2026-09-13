/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Reusable SVG Icon Component
 * Directly renders icons from `svgIconRegistry` (src/assets/icons/).
 * Simple & Extensible: Add any .svg file to src/assets/icons to use it immediately.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import { svgIconRegistry, IconLibraryName } from '../icons/svgRegistry';

export type IconName = IconLibraryName;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  style,
}) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.textPrimary;

  // Retrieve XML content directly from registry by name
  const xmlContent = useMemo(() => {
    const rawXml = svgIconRegistry[name] || svgIconRegistry.Question;
    if (!rawXml) return null;

    let processedXml = rawXml;
    if (iconColor) {
      processedXml = processedXml
        .replace(/currentColor/g, iconColor)
        .replace(/stroke="none"/g, `stroke="${iconColor}"`);
    }
    return processedXml;
  }, [name, iconColor]);

  // Dynamic wrapper style to prevent inline style objects
  const wrapperStyle = useMemo<ViewStyle>(
    () => ({
      width: size,
      height: size,
    }),
    [size]
  );

  return (
    <View style={[styles.container, wrapperStyle, style]}>
      {xmlContent ? (
        <SvgXml
          xml={xmlContent}
          width={size}
          height={size}
          color={iconColor}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

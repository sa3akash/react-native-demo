import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../theme/ThemeProvider';

export interface ContainerProps {
  readonly children: React.ReactNode;
  readonly maxWidth?: number | string;
  readonly paddingHorizontal?: keyof typeof import('../../theme/spacing').spacing;
  readonly style?: ViewStyle;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth,
  paddingHorizontal = 'md',
  style,
}) => {
  const { theme } = useTheme();
  const { responsive } = useResponsive();

  const resolvedMaxWidth =
    maxWidth ?? responsive<string | number>({ mobile: '100%', tablet: 720, tabletLarge: 960 });

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: resolvedMaxWidth as ViewStyle['maxWidth'],
          paddingHorizontal: theme.spacing[paddingHorizontal],
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
});

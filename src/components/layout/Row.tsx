import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export interface FlexLayoutProps {
  readonly children: React.ReactNode;
  readonly align?: ViewStyle['alignItems'];
  readonly justify?: ViewStyle['justifyContent'];
  readonly gap?: keyof typeof import('../../theme/spacing').spacing;
  readonly wrap?: boolean;
  readonly style?: ViewStyle;
}

export const Row: React.FC<FlexLayoutProps> = ({
  children,
  align = 'center',
  justify = 'flex-start',
  gap,
  wrap = false,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? 'wrap' : 'nowrap',
          gap: gap ? theme.spacing[gap] : undefined,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export const Column: React.FC<FlexLayoutProps> = ({
  children,
  align = 'stretch',
  justify = 'flex-start',
  gap,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'column',
          alignItems: align,
          justifyContent: justify,
          gap: gap ? theme.spacing[gap] : undefined,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

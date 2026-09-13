import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { SpacingToken } from '../../theme/spacing';

export interface SpacerProps {
  readonly size?: SpacingToken;
  readonly horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({ size = 'md', horizontal = false }) => {
  const { theme } = useTheme();
  const dimension = theme.spacing[size];

  return (
    <View
      style={{
        width: horizontal ? dimension : undefined,
        height: !horizontal ? dimension : undefined,
      }}
    />
  );
};

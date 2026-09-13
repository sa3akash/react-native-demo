import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';

export interface SegmentItem {
  id: string;
  label: string;
  badgeCount?: number;
}

export interface SegmentedControlProps {
  segments: SegmentItem[];
  activeId: string;
  onSelect: (id: string) => void;
  size?: 'sm' | 'md';
}

const SegmentedControlComponent: React.FC<SegmentedControlProps> = ({
  segments,
  activeId,
  onSelect,
  size = 'md',
}) => {
  const { colors, theme } = useTheme();
  const isRTL = I18nManager.isRTL;

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.inputBg,
          borderRadius: theme.radius.full,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          padding: isSmall ? 2 : 4,
        },
      ]}
      accessible={true}
      accessibilityRole="tablist"
    >
      {segments.map((seg) => {
        const isActive = seg.id === activeId;
        return (
          <TouchableOpacity
            key={seg.id}
            activeOpacity={0.8}
            onPress={() => onSelect(seg.id)}
            style={[
              styles.segment,
              {
                backgroundColor: isActive ? colors.surface : 'transparent',
                borderRadius: theme.radius.full,
                paddingVertical: isSmall ? 6 : 8,
                shadowColor: isActive ? '#000' : 'transparent',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isActive ? 0.15 : 0,
                shadowRadius: 2,
                elevation: isActive ? 2 : 0,
              },
            ]}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={seg.label}
          >
            <Typography
              variant={isSmall ? 'buttonSmall' : 'buttonMedium'}
              color={isActive ? colors.text : colors.textSecondary}
              bold={isActive}
            >
              {seg.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const SegmentedControl = memo(SegmentedControlComponent);

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

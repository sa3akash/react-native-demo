import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, BottomSheet } from '../../shared/components';
import {
  BACKGROUND_PRESETS,
  VirtualBackgroundType,
} from '../../core/webrtc/VirtualBackgroundService';
import { useCallStore } from '../../store/useCallStore';

export interface VirtualBackgroundModalProps {
  visible: boolean;
  onClose: () => void;
}

const VirtualBackgroundModalComponent: React.FC<VirtualBackgroundModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const virtualBackground = useCallStore((state) => state.virtualBackground);
  const setVirtualBackground = useCallStore((state) => state.setVirtualBackground);

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Effects & Virtual Backgrounds">
      <ScrollView contentContainerStyle={styles.container}>
        <Typography variant="body2" color={colors.textSecondary} style={{ marginBottom: 12 }}>
          Select a background blur or virtual scenery to enhance your video stream.
        </Typography>

        <View style={styles.grid}>
          {BACKGROUND_PRESETS.map((preset) => {
            const isSelected = virtualBackground === preset.id;
            return (
              <TouchableOpacity
                key={preset.id}
                activeOpacity={0.8}
                onPress={() => {
                  setVirtualBackground(preset.id);
                  onClose();
                }}
                style={[
                  styles.presetCard,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderRadius: theme.radius.md,
                  },
                ]}
              >
                {preset.previewUrl ? (
                  <Image source={{ uri: preset.previewUrl }} style={styles.cardImage} resizeMode="cover" />
                ) : (
                  <View style={styles.cardIconBox}>
                    <Typography variant="h1">{preset.icon}</Typography>
                  </View>
                )}

                <View style={styles.cardLabelRow}>
                  <Typography variant="caption" color={isSelected ? colors.primary : colors.text} bold numberOfLines={1}>
                    {preset.label}
                  </Typography>
                  {isSelected && (
                    <Typography variant="caption" color={colors.primary} bold>
                      ✓
                    </Typography>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export const VirtualBackgroundModal = memo(VirtualBackgroundModalComponent);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  presetCard: {
    width: '48%',
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  cardImage: {
    width: '100%',
    height: 90,
  },
  cardIconBox: {
    width: '100%',
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
});

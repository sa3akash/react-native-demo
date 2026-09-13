import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';

export const MediaUploader: React.FC<{
  progress: number; // 0 to 100
  isUploading: boolean;
  onCancel?: () => void;
}> = ({ progress, isUploading, onCancel }) => {
  const { colors, theme } = useTheme();

  if (!isUploading) return null;

  return (
    <View
      style={[
        styles.uploaderContainer,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.borderSubtle,
          borderRadius: theme.radius.md,
        },
      ]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: progress }}
    >
      <View style={styles.uploadInfoRow}>
        <Typography variant="subtitle2" color={colors.text} bold>
          Uploading media... {progress}%
        </Typography>
        {onCancel && (
          <TouchableOpacity activeOpacity={0.7} onPress={onCancel}>
            <Typography variant="caption" color={colors.danger} bold>
              Cancel
            </Typography>
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.progressBarBg, { backgroundColor: colors.inputBg }]}>
        <View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: colors.primary,
              width: `${Math.min(100, Math.max(0, progress))}%`,
              borderRadius: theme.radius.full,
            },
          ]}
        />
      </View>
    </View>
  );
};

export const VideoPlayerStub: React.FC<{
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  onPress?: () => void;
}> = ({ thumbnailUrl, duration = '0:45', onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.videoContainer, { backgroundColor: '#000000', borderRadius: theme.radius.md }]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Play video preview"
    >
      {thumbnailUrl && (
        <Image source={{ uri: thumbnailUrl }} style={styles.videoThumbnail} resizeMode="cover" />
      )}
      <View style={styles.playButtonCircle}>
        <Typography variant="h3" color="#FFFFFF">
          ▶
        </Typography>
      </View>
      <View style={styles.durationBadge}>
        <Typography variant="overline" color="#FFFFFF" bold>
          {duration}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploaderContainer: {
    padding: 12,
    borderWidth: 1,
    marginVertical: 8,
  },
  uploadInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
  },
  videoContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoThumbnail: {
    ...StyleSheet.absoluteFill,
    opacity: 0.85,
  },
  playButtonCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

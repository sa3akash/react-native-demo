import React, { useState, memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';

export interface AudioPlayerProps {
  audioUrl?: string;
  duration?: string;
  senderName?: string;
}

const WAVEFORM_HEIGHTS = [8, 14, 22, 16, 28, 20, 12, 26, 32, 18, 10, 24, 30, 16, 8, 22, 14, 18];

const AudioPlayerComponent: React.FC<AudioPlayerProps> = ({
  duration = '00:24',
}) => {
  const { colors, theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<'1x' | '1.5x' | '2x'>('1x');
  const isRTL = I18nManager.isRTL;

  const cycleSpeed = () => {
    if (speed === '1x') setSpeed('1.5x');
    else if (speed === '1.5x') setSpeed('2x');
    else setSpeed('1x');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.inputBg,
          borderRadius: theme.radius.lg,
          borderColor: colors.borderSubtle,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel="Voice note audio player"
    >
      {/* Play/Pause Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsPlaying(!isPlaying)}
        style={[styles.playBtn, { backgroundColor: colors.primary }]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause voice message' : 'Play voice message'}
      >
        <Typography variant="body1" color="#FFFFFF">
          {isPlaying ? '⏸' : '▶'}
        </Typography>
      </TouchableOpacity>

      {/* Waveform Visualizer */}
      <View style={styles.waveformRow}>
        {WAVEFORM_HEIGHTS.map((h, idx) => {
          const isPlayed = isPlaying && idx < 9;
          return (
            <View
              key={idx}
              style={[
                styles.waveBar,
                {
                  height: h,
                  backgroundColor: isPlayed ? colors.primary : colors.textMuted,
                  borderRadius: 2,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Duration & Speed */}
      <View style={styles.rightControls}>
        <Typography variant="caption" color={colors.textSecondary} bold>
          {isPlaying ? '00:10' : duration}
        </Typography>

        <TouchableOpacity
          onPress={cycleSpeed}
          style={[styles.speedBtn, { backgroundColor: colors.surfaceElevated }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Playback speed ${speed}`}
        >
          <Typography variant="caption" color={colors.primary} bold>
            {speed}
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const AudioPlayer = memo(AudioPlayerComponent);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    marginVertical: 4,
    maxWidth: 320,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 36,
    marginHorizontal: 10,
  },
  waveBar: {
    width: 3,
  },
  rightControls: {
    alignItems: 'center',
    gap: 4,
  },
  speedBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
});

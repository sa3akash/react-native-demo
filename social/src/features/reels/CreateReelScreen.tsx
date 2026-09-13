import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import {
  Typography,
  Button,
  Input,
  TextArea,
  Card,
  VideoPlayer,
} from '../../shared/components';
import { useReelsStore, ReelFilter, ReelEffect, AudioTrack } from '../../store/useReelsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { AudioLibraryModal } from './AudioLibraryModal';

export interface CreateReelScreenProps {
  onClose: () => void;
}

const FILTERS: Array<{ id: ReelFilter; label: string; icon: string }> = [
  { id: 'normal', label: 'Normal', icon: '✨' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: '🌆' },
  { id: 'vintage', label: 'Vintage', icon: '📼' },
  { id: 'cinema', label: 'Cinema', icon: '🎬' },
  { id: 'golden', label: 'Golden Hour', icon: '🌅' },
  { id: 'bw', label: 'Noir B&W', icon: '🖤' },
];

const EFFECTS: Array<{ id: ReelEffect; label: string; icon: string }> = [
  { id: 'none', label: 'None', icon: '🚫' },
  { id: 'beauty', label: 'Beauty Smooth', icon: '🌸' },
  { id: 'speed_ramp', label: 'Speed Ramp (2x)', icon: '⚡' },
  { id: 'sparkles', label: 'Sparkles', icon: '✨' },
  { id: 'flash', label: 'Beat Flash', icon: '💥' },
  { id: 'green_screen', label: 'Green Screen', icon: '🟩' },
];

const CreateReelScreenComponent: React.FC<CreateReelScreenProps> = ({ onClose }) => {
  const { colors, theme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const createReel = useReelsStore((state) => state.createReel);
  const { showToast } = useToast();

  const [description, setDescription] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ReelFilter>('cyberpunk');
  const [selectedEffect, setSelectedEffect] = useState<ReelEffect>('none');
  const [selectedAudio, setSelectedAudio] = useState<AudioTrack | null>(null);
  const [isAudioModalVisible, setIsAudioModalVisible] = useState(false);
  const [hasAutoCaptions, setHasAutoCaptions] = useState(true);

  const videoUri = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
  const videoThumbnail = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800';

  const handlePublish = () => {
    createReel({
      creatorId: user?.id || 'usr_meta_998',
      creatorName: user?.username || 'alex.rivera',
      creatorAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      isVerified: user?.isVerified,
      description: description.trim() || 'New Reel creation! 🚀 #Viral #ReactNative',
      videoUrl: videoUri,
      videoThumbnail,
      songTitle: selectedAudio?.title || 'Original Audio - alex.rivera',
      songArtist: selectedAudio?.artist || 'alex.rivera',
      songCoverUrl: selectedAudio?.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
      filter: selectedFilter,
      effect: selectedEffect,
      captions: hasAutoCaptions
        ? [
            { timestamp: 0, text: 'Auto-generated captions' },
            { timestamp: 3, text: 'AI neural speech-to-text on mobile' },
          ]
        : undefined,
    });

    showToast({ message: 'Reel published to Reels Feed! 🎬', type: 'success' });
    onClose();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle, backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
          <Typography variant="body1" color={colors.textSecondary}>
            Cancel
          </Typography>
        </TouchableOpacity>
        <Typography variant="h4" color={colors.text} bold>
          Create Reel
        </Typography>
        <Button label="Share" variant="primary" size="sm" onPress={handlePublish} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Video Preview Canvas */}
          <View style={[styles.videoPreviewWrap, { backgroundColor: '#000000', borderRadius: theme.radius.lg }]}>
            <Image source={{ uri: videoThumbnail }} style={styles.previewThumbnail} resizeMode="cover" />

            {/* Overlay Badges */}
            <View style={styles.overlayBadges}>
              {selectedFilter !== 'normal' && (
                <View style={styles.badgePill}>
                  <Typography variant="caption" color="#FFFFFF" bold>
                    🎨 {selectedFilter.toUpperCase()}
                  </Typography>
                </View>
              )}
              {selectedEffect !== 'none' && (
                <View style={styles.badgePill}>
                  <Typography variant="caption" color="#FFFFFF" bold>
                    ✨ {selectedEffect.toUpperCase()}
                  </Typography>
                </View>
              )}
            </View>
          </View>

          {/* Soundtrack Selector */}
          <TouchableOpacity
            onPress={() => setIsAudioModalVisible(true)}
            style={[styles.audioSelectorCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
          >
            <Typography variant="h3">🎵</Typography>
            <View style={styles.audioTextCol}>
              <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1}>
                {selectedAudio ? selectedAudio.title : 'Add Audio Soundtrack'}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                {selectedAudio ? `${selectedAudio.artist} • ${selectedAudio.duration}` : 'Choose from thousands of trending songs'}
              </Typography>
            </View>
            <Typography variant="caption" color={colors.primary} bold>
              {selectedAudio ? 'Change' : 'Select'}
            </Typography>
          </TouchableOpacity>

          {/* Caption Input */}
          <TextArea
            label="Reel Caption"
            placeholder="Write a catchy caption, use #hashtags and @mentions..."
            value={description}
            onChangeText={setDescription}
            maxLength={300}
            showCharCount
          />

          {/* Filters Selector */}
          <Typography variant="subtitle2" color={colors.text} bold style={{ marginTop: 14, marginBottom: 8 }}>
            🎨 Cinematic Visual Filters
          </Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {FILTERS.map((f) => {
              const isSelected = selectedFilter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => setSelectedFilter(f.id)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : colors.inputBg,
                      borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    },
                  ]}
                >
                  <Typography variant="h4">{f.icon}</Typography>
                  <Typography variant="caption" color={isSelected ? colors.primary : colors.text} bold>
                    {f.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Effects Selector */}
          <Typography variant="subtitle2" color={colors.text} bold style={{ marginTop: 14, marginBottom: 8 }}>
            ⚡ Video Effects & Speed
          </Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {EFFECTS.map((e) => {
              const isSelected = selectedEffect === e.id;
              return (
                <TouchableOpacity
                  key={e.id}
                  onPress={() => setSelectedEffect(e.id)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : colors.inputBg,
                      borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    },
                  ]}
                >
                  <Typography variant="h4">{e.icon}</Typography>
                  <Typography variant="caption" color={isSelected ? colors.primary : colors.text} bold>
                    {e.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Auto-Captions Toggle */}
          <TouchableOpacity
            onPress={() => setHasAutoCaptions(!hasAutoCaptions)}
            style={[styles.autoCaptionsRow, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
          >
            <View style={{ flex: 1 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                💬 Auto-Generate Subtitles
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                AI on-device speech-to-text subtitles for accessibility
              </Typography>
            </View>
            <Typography variant="subtitle1" color={hasAutoCaptions ? colors.success : colors.textMuted} bold>
              {hasAutoCaptions ? '✓ ON' : 'OFF'}
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Audio Library Modal */}
      <AudioLibraryModal
        visible={isAudioModalVisible}
        onClose={() => setIsAudioModalVisible(false)}
        onSelectTrack={(track) => setSelectedAudio(track)}
      />
    </SafeAreaView>
  );
};

export const CreateReelScreen = memo(CreateReelScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  videoPreviewWrap: {
    height: 220,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  previewThumbnail: {
    width: '100%',
    height: '100%',
  },
  overlayBadges: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  badgePill: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  audioSelectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 14,
  },
  audioTextCol: {
    flex: 1,
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 85,
    gap: 4,
  },
  autoCaptionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
});

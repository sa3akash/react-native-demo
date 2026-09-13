import React, { useState, memo } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Button, Input, Modal } from '../../shared/components';
import { useReelsStore, ReelModel } from '../../store/useReelsStore';
import { useToast } from '../../shared/components/molecules/Toast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ReelRemixModalProps {
  visible: boolean;
  reel: ReelModel | null;
  onClose: () => void;
}

const ReelRemixModalComponent: React.FC<ReelRemixModalProps> = ({
  visible,
  reel,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const createRemix = useReelsStore((state) => state.createRemix);
  const { showToast } = useToast();

  const [description, setDescription] = useState('Reacting to this breakthrough!');
  const [recordedVideoUri, setRecordedVideoUri] = useState('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4');

  const handlePublishRemix = () => {
    if (!reel) return;
    createRemix(reel.id, {
      videoUrl: recordedVideoUri,
      description: description.trim(),
    });
    showToast({ message: `Remix with @${reel.creatorName} published! 🎬`, type: 'success' });
    onClose();
  };

  if (!reel) return null;

  return (
    <Modal visible={visible} onClose={onClose} title="Remix Reel (Duet)">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.content}>
        {/* Split Screen Duet Preview */}
        <View style={[styles.splitPreview, { backgroundColor: '#000000', borderRadius: theme.radius.lg }]}>
          {/* Left: Original Reel */}
          <View style={styles.halfScreen}>
            <Image source={{ uri: reel.videoThumbnail }} style={styles.videoFill} resizeMode="cover" />
            <View style={styles.creatorTag}>
              <Typography variant="caption" color="#FFFFFF" bold numberOfLines={1}>
                @{reel.creatorName}
              </Typography>
            </View>
          </View>

          {/* Right: Your Recording */}
          <View style={[styles.halfScreen, { borderLeftWidth: 2, borderLeftColor: '#0A84FF' }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600' }}
              style={styles.videoFill}
              resizeMode="cover"
            />
            <View style={[styles.creatorTag, { backgroundColor: '#0A84FF' }]}>
              <Typography variant="caption" color="#FFFFFF" bold>
                You (Duet)
              </Typography>
            </View>
          </View>
        </View>

        {/* Audio Track Tag */}
        <View style={[styles.soundTag, { backgroundColor: colors.inputBg }]}>
          <Typography variant="caption" color={colors.primary} bold numberOfLines={1}>
            🎵 Sound: {reel.songTitle}
          </Typography>
        </View>

        <Input
          label="Remix Caption"
          placeholder="Add commentary to your remix..."
          value={description}
          onChangeText={setDescription}
        />

        <Button
          label="Post Duet Remix"
          variant="primary"
          size="lg"
          onPress={handlePublishRemix}
          fullWidth
          style={{ marginTop: 14 }}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

export const ReelRemixModal = memo(ReelRemixModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
  },
  splitPreview: {
    flexDirection: 'row',
    height: 220,
    overflow: 'hidden',
    marginBottom: 12,
  },
  halfScreen: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  videoFill: {
    width: '100%',
    height: '100%',
  },
  creatorTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  soundTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
});

import React, { useState, memo } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Button, Input, Modal } from '../../shared/components';
import { useStoryStore, StoryMusic, StoryPoll, StoryQuestion } from '../../store/useStoryStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface CreateStoryModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateStoryModalComponent: React.FC<CreateStoryModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const addStory = useStoryStore((state) => state.addStory);
  const { showToast } = useToast();

  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1518770660439-4636190af475?w=800');
  const [caption, setCaption] = useState('');
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'music' | 'poll' | 'question'>('none');

  // Music state
  const [musicTrack, setMusicTrack] = useState<StoryMusic | undefined>(undefined);

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOpt1, setPollOpt1] = useState('Yes 🔥');
  const [pollOpt2, setPollOpt2] = useState('No 👎');

  // Question state
  const [questionPrompt, setQuestionPrompt] = useState('');

  const handleAttachMusic = () => {
    setMusicTrack({
      title: 'Neon Dreams',
      artist: 'Kavinsky',
      albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
    });
    setActiveOverlay('none');
    showToast({ message: 'Music track attached! 🎵', type: 'success' });
  };

  const handleAttachPoll = () => {
    if (!pollQuestion.trim()) {
      showToast({ message: 'Please enter a poll question.', type: 'warning' });
      return;
    }
    setActiveOverlay('none');
    showToast({ message: 'Poll sticker attached! 📊', type: 'success' });
  };

  const handleAttachQuestion = () => {
    if (!questionPrompt.trim()) {
      showToast({ message: 'Please enter a question prompt.', type: 'warning' });
      return;
    }
    setActiveOverlay('none');
    showToast({ message: 'Question prompt attached! 💬', type: 'success' });
  };

  const handlePublishStory = () => {
    let pollObj: StoryPoll | undefined = undefined;
    if (pollQuestion.trim()) {
      pollObj = {
        question: pollQuestion.trim(),
        options: [
          { id: 'opt_1', text: pollOpt1 || 'Option 1', votes: 0 },
          { id: 'opt_2', text: pollOpt2 || 'Option 2', votes: 0 },
        ],
        totalVotes: 0,
      };
    }

    let questionObj: StoryQuestion | undefined = undefined;
    if (questionPrompt.trim()) {
      questionObj = {
        prompt: questionPrompt.trim(),
        responses: [],
      };
    }

    addStory({
      mediaUrl,
      type: 'image',
      caption: caption.trim() || undefined,
      music: musicTrack,
      poll: pollObj,
      questionPrompt: questionObj,
    });

    showToast({ message: 'Story added to your 24h timeline! ✨', type: 'success' });
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} onClose={onClose} title="Create 24h Story">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContent}>
        {/* Story Media Canvas Preview */}
        <View style={[styles.canvasPreview, { backgroundColor: '#000000', borderRadius: theme.radius.lg }]}>
          <Image source={{ uri: mediaUrl }} style={styles.canvasImage} resizeMode="cover" />

          {/* Music Sticker Overlay */}
          {musicTrack && (
            <View style={[styles.musicBadge, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
              <Typography variant="body2" color="#FFFFFF" bold>
                🎵 {musicTrack.title} • {musicTrack.artist}
              </Typography>
            </View>
          )}

          {/* Poll Overlay Preview */}
          {pollQuestion.length > 0 && (
            <View style={[styles.pollOverlay, { backgroundColor: colors.surface, borderRadius: theme.radius.md }]}>
              <Typography variant="subtitle2" color={colors.text} bold>
                📊 {pollQuestion}
              </Typography>
              <View style={styles.pollBtnRow}>
                <View style={[styles.pollChoice, { backgroundColor: colors.primaryLight }]}>
                  <Typography variant="caption" color={colors.primary} bold>{pollOpt1}</Typography>
                </View>
                <View style={[styles.pollChoice, { backgroundColor: colors.inputBg }]}>
                  <Typography variant="caption" color={colors.text} bold>{pollOpt2}</Typography>
                </View>
              </View>
            </View>
          )}

          {/* Question Overlay Preview */}
          {questionPrompt.length > 0 && (
            <View style={[styles.questionOverlay, { backgroundColor: colors.surface, borderRadius: theme.radius.md }]}>
              <Typography variant="subtitle2" color={colors.text} bold>
                💬 {questionPrompt}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Type an answer...
              </Typography>
            </View>
          )}
        </View>

        <Input
          placeholder="Add a caption..."
          value={caption}
          onChangeText={setCaption}
        />

        {/* Sticker / Overlay Buttons */}
        <View style={styles.stickersBar}>
          <TouchableOpacity onPress={handleAttachMusic} style={[styles.stickerBtn, { backgroundColor: colors.inputBg }]}>
            <Typography variant="caption" color={colors.text} bold>🎵 Music</Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveOverlay('poll')} style={[styles.stickerBtn, { backgroundColor: colors.inputBg }]}>
            <Typography variant="caption" color={colors.text} bold>📊 Poll</Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveOverlay('question')} style={[styles.stickerBtn, { backgroundColor: colors.inputBg }]}>
            <Typography variant="caption" color={colors.text} bold>💬 AMA Question</Typography>
          </TouchableOpacity>
        </View>

        {/* Dynamic Overlay Form Builder */}
        {activeOverlay === 'poll' && (
          <View style={styles.overlayBuilder}>
            <Input label="Poll Question" placeholder="Ask a question..." value={pollQuestion} onChangeText={setPollQuestion} autoFocus />
            <View style={styles.optRow}>
              <View style={{ flex: 1 }}><Input label="Option 1" value={pollOpt1} onChangeText={setPollOpt1} /></View>
              <View style={{ flex: 1 }}><Input label="Option 2" value={pollOpt2} onChangeText={setPollOpt2} /></View>
            </View>
            <Button label="Done" size="sm" variant="primary" onPress={handleAttachPoll} />
          </View>
        )}

        {activeOverlay === 'question' && (
          <View style={styles.overlayBuilder}>
            <Input label="Question Prompt" placeholder="e.g. Ask me anything..." value={questionPrompt} onChangeText={setQuestionPrompt} autoFocus />
            <Button label="Done" size="sm" variant="primary" onPress={handleAttachQuestion} />
          </View>
        )}

        <Button
          label="Share Story to Timeline"
          variant="primary"
          size="lg"
          onPress={handlePublishStory}
          fullWidth
          style={{ marginTop: 12 }}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

export const CreateStoryModal = memo(CreateStoryModalComponent);

const styles = StyleSheet.create({
  modalContent: {
    paddingTop: 8,
  },
  canvasPreview: {
    width: '100%',
    height: 220,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasImage: {
    ...StyleSheet.absoluteFill,
  },
  musicBadge: {
    position: 'absolute',
    top: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pollOverlay: {
    padding: 12,
    width: '85%',
    alignItems: 'center',
  },
  pollBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    width: '100%',
  },
  pollChoice: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  questionOverlay: {
    padding: 12,
    width: '85%',
    alignItems: 'center',
  },
  stickersBar: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  stickerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  overlayBuilder: {
    paddingVertical: 8,
    gap: 8,
  },
  optRow: {
    flexDirection: 'row',
    gap: 8,
  },
});

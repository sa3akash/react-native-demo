import React, { useState, useEffect, useRef, memo } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
  I18nManager,
} from 'react-native';
import { Typography, Avatar, VideoPlayer } from '../../shared/components';
import { StoryUser } from '../feed/StoryBar';
import { useStoryStore, StoryItem } from '../../store/useStoryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { StoryViewersModal } from './StoryViewersModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STORY_DURATION_MS = 5000;

export interface StoryViewerScreenProps {
  storyUser: StoryUser;
  onClose: () => void;
  onNextUser?: () => void;
}

const StoryViewerScreenComponent: React.FC<StoryViewerScreenProps> = ({
  storyUser,
  onClose,
  onNextUser,
}) => {
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const { userStories, recordStoryView, reactToStory, voteStoryPoll, answerStoryQuestion } = useStoryStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [questionAnswer, setQuestionAnswer] = useState('');
  const [isViewersModalVisible, setIsViewersModalVisible] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;

  const displayName = storyUser.userName || (storyUser as any).name || 'User';
  const displayAvatar = storyUser.userAvatar || (storyUser as any).avatarUrl || '';

  // Retrieve current active story from store
  const currentGroup = userStories.find((g) => g.userId === storyUser.id) || {
    id: storyUser.id,
    userId: storyUser.id,
    userName: displayName,
    userAvatar: displayAvatar,
    stories: storyUser.stories as any[],
  };

  const storiesCount = currentGroup.stories.length || 1;
  const currentStory: StoryItem = (currentGroup.stories[currentIndex] || currentGroup.stories[0]) as any;

  // Record view on open
  useEffect(() => {
    if (currentStory && user) {
      recordStoryView(storyUser.id, currentStory.id, {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatarUrl,
      });
    }
  }, [currentStory, user, storyUser.id, recordStoryView]);

  // Progress Bar timer
  useEffect(() => {
    progressAnim.setValue(0);

    if (!isPaused && !isViewersModalVisible) {
      const anim = Animated.timing(progressAnim, {
        toValue: 1,
        duration: STORY_DURATION_MS,
        useNativeDriver: false,
      });

      anim.start(({ finished }) => {
        if (finished) {
          if (currentIndex < storiesCount - 1) {
            setCurrentIndex((i) => i + 1);
          } else {
            if (onNextUser) {
              onNextUser();
            } else {
              onClose();
            }
          }
        }
      });

      return () => anim.stop();
    }
  }, [currentIndex, isPaused, isViewersModalVisible, progressAnim, storiesCount, onClose, onNextUser]);

  const handleNextStory = () => {
    if (currentIndex < storiesCount - 1) {
      setCurrentIndex((i) => i + 1);
    } else if (onNextUser) {
      onNextUser();
    } else {
      onClose();
    }
  };

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSendReaction = (emoji: string) => {
    if (user && currentStory) {
      reactToStory(storyUser.id, currentStory.id, emoji, {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatarUrl,
      });
      showToast({ message: `Reacted ${emoji} to story!`, type: 'info' });
    }
  };

  const handleVotePoll = (optId: string) => {
    if (currentStory) {
      voteStoryPoll(storyUser.id, currentStory.id, optId);
      showToast({ message: 'Vote submitted! 📊', type: 'success' });
    }
  };

  const handleAnswerQuestion = () => {
    if (!questionAnswer.trim() || !currentStory) return;
    answerStoryQuestion(storyUser.id, currentStory.id, questionAnswer.trim(), user?.name || 'Alex');
    showToast({ message: 'Response sent to author! 💬', type: 'success' });
    setQuestionAnswer('');
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    showToast({ message: `Direct message sent to ${displayName}! ✉️`, type: 'success' });
    setReplyText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Media */}
      <TouchableWithoutFeedback
        onPressIn={() => setIsPaused(true)}
        onPressOut={() => setIsPaused(false)}
      >
        <View style={styles.mediaContainer}>
          {currentStory.type === 'video' ? (
            <VideoPlayer videoUrl={currentStory.mediaUrl} />
          ) : (
            <Image
              source={{ uri: currentStory.mediaUrl }}
              style={styles.storyMedia}
              resizeMode="cover"
            />
          )}

          {/* Left/Right tap zones */}
          <TouchableOpacity
            style={styles.touchLeft}
            onPress={handlePrevStory}
            activeOpacity={1}
          />
          <TouchableOpacity
            style={styles.touchRight}
            onPress={handleNextStory}
            activeOpacity={1}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* Top Segmented Progress Bars */}
      <View style={styles.progressContainer}>
        {Array.from({ length: storiesCount }).map((_, idx) => {
          let fillWidth: any = '0%';
          if (idx < currentIndex) fillWidth = '100%';
          else if (idx === currentIndex) {
            fillWidth = progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            });
          }

          return (
            <View key={idx} style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: fillWidth }]} />
            </View>
          );
        })}
      </View>

      {/* Header Info */}
      <View style={styles.header}>
        <Avatar uri={displayAvatar} name={displayName} size="sm" />
        <View style={styles.headerTextCol}>
          <Typography variant="subtitle2" color="#FFFFFF" bold>
            {displayName}
          </Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.7)">
            {currentStory.createdAt || '1h ago'}
          </Typography>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessible={true} accessibilityRole="button">
          <Typography variant="h3" color="#FFFFFF">
            ✕
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Music Sticker Overlay */}
      {currentStory.music && (
        <View style={styles.musicOverlay}>
          <Typography variant="caption" color="#FFFFFF" bold>
            🎵 {currentStory.music.title} • {currentStory.music.artist}
          </Typography>
        </View>
      )}

      {/* Poll Sticker Overlay */}
      {currentStory.poll && (
        <View style={styles.pollOverlayCard}>
          <Typography variant="subtitle1" color="#000000" bold style={{ marginBottom: 8, textAlign: 'center' }}>
            📊 {currentStory.poll.question}
          </Typography>
          <View style={styles.pollOptionsCol}>
            {currentStory.poll.options.map((opt) => {
              const total = currentStory.poll?.totalVotes || 1;
              const percent = Math.round((opt.votes / Math.max(1, total)) * 100);
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => handleVotePoll(opt.id)}
                  style={[styles.pollChoiceBtn, opt.userVoted && styles.pollChoiceBtnSelected]}
                >
                  <Typography variant="subtitle2" color={opt.userVoted ? '#0A84FF' : '#000000'} bold>
                    {opt.text}
                  </Typography>
                  <Typography variant="caption" color="#666666" bold>
                    {percent}%
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Question Sticker Overlay */}
      {currentStory.questionPrompt && (
        <View style={styles.questionOverlayCard}>
          <Typography variant="subtitle2" color="#000000" bold style={{ marginBottom: 6, textAlign: 'center' }}>
            💬 {currentStory.questionPrompt.prompt}
          </Typography>
          <View style={styles.questionInputRow}>
            <TextInput
              placeholder="Type an answer..."
              placeholderTextColor="#888888"
              value={questionAnswer}
              onChangeText={setQuestionAnswer}
              style={styles.questionInput}
            />
            <TouchableOpacity onPress={handleAnswerQuestion} style={styles.sendAnswerBtn}>
              <Typography variant="caption" color="#0A84FF" bold>Send</Typography>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Caption Text */}
      {currentStory.caption && (
        <View style={styles.captionContainer}>
          <Typography variant="body1" color="#FFFFFF" style={styles.captionText}>
            {currentStory.caption}
          </Typography>
        </View>
      )}

      {/* Bottom Actions Row */}
      <View style={styles.bottomBar}>
        {/* Quick Reactions */}
        <View style={styles.reactionsRow}>
          {['🔥', '❤️', '😂', '😮', '😢', '👏'].map((emoji) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => handleSendReaction(emoji)}
              style={styles.reactionBtn}
            >
              <Typography variant="h3">{emoji}</Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Direct Reply Bar */}
        <View style={styles.replyRow}>
          <TextInput
            placeholder={`Reply to ${displayName}...`}
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={replyText}
            onChangeText={setReplyText}
            style={styles.replyInput}
          />
          <TouchableOpacity onPress={handleSendReply} style={styles.sendReplyBtn}>
            <Typography variant="subtitle2" color="#0A84FF" bold>
              Send
            </Typography>
          </TouchableOpacity>

          {/* Viewers Trigger Button */}
          {currentStory.viewers && (
            <TouchableOpacity
              onPress={() => setIsViewersModalVisible(true)}
              style={styles.viewersTriggerBtn}
            >
              <Typography variant="caption" color="#FFFFFF" bold>
                👀 {currentStory.viewers.length}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Story Viewers Bottom Sheet */}
      <StoryViewersModal
        visible={isViewersModalVisible}
        viewers={currentStory.viewers || []}
        onClose={() => setIsViewersModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export const StoryViewerScreen = memo(StoryViewerScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mediaContainer: {
    ...StyleSheet.absoluteFill,
  },
  storyMedia: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  touchLeft: {
    position: 'absolute',
    top: 60,
    bottom: 120,
    left: 0,
    width: SCREEN_WIDTH * 0.35,
  },
  touchRight: {
    position: 'absolute',
    top: 60,
    bottom: 120,
    right: 0,
    width: SCREEN_WIDTH * 0.65,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 4,
    zIndex: 10,
  },
  progressTrack: {
    flex: 1,
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    zIndex: 10,
  },
  headerTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  closeBtn: {
    padding: 6,
  },
  musicOverlay: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 10,
    zIndex: 10,
  },
  pollOverlayCard: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    width: '80%',
    marginTop: '30%',
    zIndex: 10,
  },
  pollOptionsCol: {
    gap: 8,
  },
  pollChoiceBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  pollChoiceBtnSelected: {
    backgroundColor: '#E0F0FF',
    borderWidth: 1.5,
    borderColor: '#0A84FF',
  },
  questionOverlayCard: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    width: '80%',
    marginTop: '25%',
    zIndex: 10,
  },
  questionInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  questionInput: {
    flex: 1,
    height: 36,
    color: '#000000',
    fontSize: 14,
  },
  sendAnswerBtn: {
    padding: 4,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  captionText: {
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    zIndex: 10,
    gap: 10,
  },
  reactionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  reactionBtn: {
    padding: 4,
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replyInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sendReplyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewersTriggerBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
  },
});

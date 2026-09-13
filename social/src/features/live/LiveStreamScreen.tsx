import React, { useState, useEffect, memo } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Animated,
  I18nManager,
} from 'react-native';
import { Typography, Avatar, Button } from '../../shared/components';
import {
  useLiveStreamStore,
  LiveCoHost,
  LiveChatMessage,
  GiftEvent,
} from '../../store/useLiveStreamStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { LiveGiftsModal } from './LiveGiftsModal';
import { MultiGuestModal } from './MultiGuestModal';
import { LiveModerationModal } from './LiveModerationModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface LiveStreamScreenProps {
  onClose: () => void;
}

export const LiveStreamScreenComponent: React.FC<LiveStreamScreenProps> = ({ onClose }) => {
  const { showToast } = useToast();

  const title = useLiveStreamStore((state) => state.title);
  const viewerCount = useLiveStreamStore((state) => state.viewerCount);
  const likesCount = useLiveStreamStore((state) => state.likesCount);
  const totalCoins = useLiveStreamStore((state) => state.totalCoins);
  const durationSeconds = useLiveStreamStore((state) => state.durationSeconds);
  const isMuted = useLiveStreamStore((state) => state.isMuted);
  const isFrontCamera = useLiveStreamStore((state) => state.isFrontCamera);
  const coHosts = useLiveStreamStore((state) => state.coHosts);
  const comments = useLiveStreamStore((state) => state.comments);
  const pinnedCommentId = useLiveStreamStore((state) => state.pinnedCommentId);
  const recentGifts = useLiveStreamStore((state) => state.recentGiftEvents);

  const toggleMute = useLiveStreamStore((state) => state.toggleMute);
  const switchCamera = useLiveStreamStore((state) => state.switchCamera);
  const sendComment = useLiveStreamStore((state) => state.sendComment);
  const incrementLikes = useLiveStreamStore((state) => state.incrementLikes);
  const pinComment = useLiveStreamStore((state) => state.pinComment);
  const unpinComment = useLiveStreamStore((state) => state.unpinComment);
  const endStream = useLiveStreamStore((state) => state.endStream);

  const [commentInput, setCommentInput] = useState('');
  const [isGiftsModalOpen, setIsGiftsModalOpen] = useState(false);
  const [isMultiGuestOpen, setIsMultiGuestOpen] = useState(false);
  const [isModerationOpen, setIsModerationOpen] = useState(false);

  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; left: number }>>([]);
  const isRTL = I18nManager.isRTL;

  const pinnedComment = comments.find((c) => c.id === pinnedCommentId);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    sendComment(commentInput.trim());
    setCommentInput('');
  };

  const triggerLike = () => {
    incrementLikes();
    const newHeart = { id: Date.now() + Math.random(), left: Math.random() * 60 + 20 };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 2000);
  };

  const renderVideoGrid = () => {
    if (coHosts.length === 1) {
      return (
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080' }}
          style={styles.fullVideo}
          resizeMode="cover"
        />
      );
    }

    if (coHosts.length === 2) {
      return (
        <View style={styles.splitGrid2}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800' }} style={styles.splitHalf} resizeMode="cover" />
          <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800' }} style={styles.splitHalf} resizeMode="cover" />
        </View>
      );
    }

    return (
      <View style={styles.splitGrid4}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600' }} style={styles.gridQuad} resizeMode="cover" />
        <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600' }} style={styles.gridQuad} resizeMode="cover" />
        <Image source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600' }} style={styles.gridQuad} resizeMode="cover" />
        <Image source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600' }} style={styles.gridQuad} resizeMode="cover" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Video Stream Layout */}
      {renderVideoGrid()}

      {/* Dark Gradient Overlay for Readability */}
      <View style={styles.darkGradient} pointerEvents="none" />

      {/* 1. TOP STATUS BAR */}
      <View style={styles.topInfoBar}>
        <View style={styles.hostPill}>
          <Avatar uri="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400" name="Alex Rivera" size="sm" />
          <View style={{ marginLeft: 6 }}>
            <Typography variant="caption" color="#FFFFFF" bold numberOfLines={1}>
              {title}
            </Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.liveIndicator} />
              <Typography variant="caption" color="#FFFFFF" bold style={{ fontSize: 9 }}>
                LIVE • {formatTimer(durationSeconds)}
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.topRightStats}>
          <View style={styles.statPill}>
            <Typography variant="caption" color="#FFFFFF" bold>
              👁️ {(viewerCount).toLocaleString()}
            </Typography>
          </View>

          <View style={[styles.statPill, { backgroundColor: '#FFD70030' }]}>
            <Typography variant="caption" color="#FFD700" bold>
              🪙 {totalCoins.toLocaleString()}
            </Typography>
          </View>

          <TouchableOpacity
            onPress={() => {
              endStream();
              onClose();
            }}
            style={styles.closeBtn}
          >
            <Typography variant="caption" color="#FFFFFF" bold>
              ✕
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Gift Notification Banner */}
      {recentGifts.length > 0 && (
        <View style={styles.giftBanner}>
          <Typography variant="h3">{recentGifts[0].giftEmoji}</Typography>
          <View style={{ marginLeft: 8 }}>
            <Typography variant="caption" color="#FFFFFF" bold>
              {recentGifts[0].senderName} sent a {recentGifts[0].giftName}!
            </Typography>
            <Typography variant="caption" color="#FFD700" bold style={{ fontSize: 10 }}>
              + {recentGifts[0].coinValue} Coins
            </Typography>
          </View>
        </View>
      )}

      {/* 2. CHAT FEED & PINNED COMMENT */}
      <View style={styles.chatContainer}>
        {/* Pinned Message */}
        {pinnedComment && (
          <View style={styles.pinnedBox}>
            <Typography variant="caption" color="#FFD700" bold>
              📌 PINNED: {pinnedComment.userName}
            </Typography>
            <Typography variant="caption" color="#FFFFFF" numberOfLines={2}>
              {pinnedComment.text}
            </Typography>
          </View>
        )}

        {/* Scrolling Chat */}
        <ScrollView style={styles.chatScroll} showsVerticalScrollIndicator={false}>
          {comments.map((msg) => (
            <TouchableOpacity
              key={msg.id}
              activeOpacity={0.8}
              onLongPress={() => {
                if (pinnedCommentId === msg.id) {
                  unpinComment();
                } else {
                  pinComment(msg.id);
                  showToast({ message: 'Comment pinned to top 📌', type: 'info' });
                }
              }}
              style={styles.commentBubble}
            >
              <Avatar uri={msg.userAvatar} name={msg.userName} size="sm" />
              <View style={styles.commentTextCol}>
                <Typography variant="caption" color="#FFD700" bold>
                  {msg.userName} {msg.isBadge && '⭐'}
                </Typography>
                <Typography variant="caption" color="#FFFFFF">
                  {msg.text}
                </Typography>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Floating Animated Hearts */}
      {floatingHearts.map((heart) => (
        <View key={heart.id} style={[styles.floatingHeart, { left: `${heart.left}%` }]}>
          <Typography variant="h2">❤️</Typography>
        </View>
      ))}

      {/* 3. BOTTOM CONTROL BAR */}
      <View style={styles.bottomControlBar}>
        {/* Chat Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.commentTextInput}
            placeholder="Say something nice..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={commentInput}
            onChangeText={setCommentInput}
            onSubmitEditing={handleSendComment}
          />
          {commentInput.trim().length > 0 && (
            <TouchableOpacity onPress={handleSendComment} style={styles.sendIconBtn}>
              <Typography variant="caption" color="#0A84FF" bold>
                Send
              </Typography>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity onPress={triggerLike} style={styles.controlIconBtn}>
          <Typography variant="h3">❤️</Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsGiftsModalOpen(true)} style={[styles.controlIconBtn, { backgroundColor: '#FF2D55' }]}>
          <Typography variant="h3">🎁</Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsMultiGuestOpen(true)} style={styles.controlIconBtn}>
          <Typography variant="h3">👥</Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMute} style={styles.controlIconBtn}>
          <Typography variant="h3">{isMuted ? '🔇' : '🎙️'}</Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchCamera} style={styles.controlIconBtn}>
          <Typography variant="h3">🔄</Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsModerationOpen(true)} style={styles.controlIconBtn}>
          <Typography variant="h3">🛡️</Typography>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <LiveGiftsModal
        visible={isGiftsModalOpen}
        onClose={() => setIsGiftsModalOpen(false)}
      />

      <MultiGuestModal
        visible={isMultiGuestOpen}
        onClose={() => setIsMultiGuestOpen(false)}
      />

      <LiveModerationModal
        visible={isModerationOpen}
        onClose={() => setIsModerationOpen(false)}
      />
    </View>
  );
};

export const LiveStreamScreen = memo(LiveStreamScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  splitGrid2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
  },
  splitHalf: {
    width: '100%',
    height: '50%',
  },
  splitGrid4: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridQuad: {
    width: '50%',
    height: '50%',
  },
  darkGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topInfoBar: {
    position: 'absolute',
    top: 44,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  hostPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    maxWidth: '50%',
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF2D55',
    marginRight: 4,
  },
  topRightStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statPill: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  closeBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftBanner: {
    position: 'absolute',
    top: 100,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  chatContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 70,
    maxHeight: 220,
  },
  pinnedBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  chatScroll: {
    flex: 1,
  },
  commentBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 6,
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  commentTextCol: {
    marginLeft: 8,
  },
  floatingHeart: {
    position: 'absolute',
    bottom: 120,
    zIndex: 99,
  },
  bottomControlBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 44,
  },
  commentTextInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
  },
  sendIconBtn: {
    paddingHorizontal: 6,
  },
  controlIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

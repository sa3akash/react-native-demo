import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  I18nManager,
  Animated,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, BottomSheet } from '../../shared/components';
import { useChatStore, ChatMessage, MessageType } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { ForwardMessageModal } from './ForwardMessageModal';
import { ScheduleMessageModal } from './ScheduleMessageModal';

export interface ChatRoomScreenProps {
  conversationId: string;
  onBack: () => void;
  onStartCall: (isVideo: boolean) => void;
}

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥'];

export const ChatRoomScreenComponent: React.FC<ChatRoomScreenProps> = ({
  conversationId,
  onBack,
  onStartCall,
}) => {
  const { colors, theme } = useTheme();
  const { user } = useAuthStore();
  const {
    conversations,
    messages,
    typingUsers,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    pinMessage,
    unpinMessage,
    setTyping,
    markAsRead,
  } = useChatStore();
  const { showToast } = useToast();

  const [inputText, setInputText] = useState('');
  const [replyTarget, setReplyTarget] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [selectedMessageAction, setSelectedMessageAction] = useState<ChatMessage | null>(null);

  // Attachment & Voice states
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voicePlaybackSpeed, setVoicePlaybackSpeed] = useState<Record<string, number>>({});

  // Forward & Schedule modals
  const [forwardTargetMsg, setForwardTargetMsg] = useState<ChatMessage | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const isRTL = I18nManager.isRTL;

  const conversation =
    conversations.find((c) => c.id === conversationId) || conversations[0];
  const messageList = messages[conversationId] || [];
  const typers = typingUsers[conversationId] || [];

  const pinnedMsg = messageList.find((m) => m.isPinned);

  // Mark messages as read on view
  useEffect(() => {
    markAsRead(conversationId);
  }, [conversationId, messageList.length, markAsRead]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    if (editingMessage) {
      editMessage(conversationId, editingMessage.id, inputText.trim());
      showToast({ message: 'Message updated! ✏️', type: 'info' });
      setEditingMessage(null);
      setInputText('');
      return;
    }

    sendMessage({
      conversationId,
      content: inputText.trim(),
      type: 'text',
      replyToMessage: replyTarget
        ? {
            id: replyTarget.id,
            senderName: replyTarget.senderName,
            content: replyTarget.content,
            type: replyTarget.type,
          }
        : undefined,
    });

    setInputText('');
    setReplyTarget(null);
    setTyping(conversationId, 'Alex Rivera', false);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMedia = (type: MessageType, mediaUrl: string, content: string, extra?: any) => {
    sendMessage({
      conversationId,
      content,
      type,
      mediaUrl,
      fileName: extra?.fileName,
      fileSizeBytes: extra?.fileSizeBytes,
      voiceDuration: extra?.voiceDuration,
      replyToMessage: replyTarget
        ? {
            id: replyTarget.id,
            senderName: replyTarget.senderName,
            content: replyTarget.content,
            type: replyTarget.type,
          }
        : undefined,
    });
    setIsAttachMenuOpen(false);
    setReplyTarget(null);
    showToast({ message: `${type.toUpperCase()} sent! 🚀`, type: 'success' });
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendVoice = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      handleSendMedia(
        'voice',
        'https://sample-audio.com/voice_sample_1.mp3',
        'Voice message (0:24)',
        { voiceDuration: '0:24' }
      );
    }, 1000);
  };

  const handleConfirmSchedule = (scheduleText: string) => {
    if (!inputText.trim()) {
      showToast({ message: 'Type a message to schedule.', type: 'warning' });
      return;
    }

    sendMessage({
      conversationId,
      content: inputText.trim(),
      type: 'text',
      scheduledFor: scheduleText,
    });

    showToast({ message: `Message scheduled for ${scheduleText}! ⏰`, type: 'success' });
    setInputText('');
  };

  const toggleVoiceSpeed = (msgId: string) => {
    setVoicePlaybackSpeed((prev) => {
      const current = prev[msgId] || 1.0;
      const next = current === 1.0 ? 1.5 : current === 1.5 ? 2.0 : 1.0;
      return { ...prev, [msgId]: next };
    });
  };

  const renderMessageBubble = ({ item }: { item: ChatMessage }) => {
    const isOwn = item.senderId === 'usr_meta_998';
    const speed = voicePlaybackSpeed[item.id] || 1.0;

    return (
      <View
        style={[
          styles.messageRowWrapper,
          {
            justifyContent: isOwn ? 'flex-end' : 'flex-start',
            flexDirection: isRTL ? (isOwn ? 'row' : 'row-reverse') : isOwn ? 'row-reverse' : 'row',
          },
        ]}
      >
        {!isOwn && (
          <View style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }}>
            <Avatar
              uri={item.senderAvatar}
              name={item.senderName}
              size="sm"
            />
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.9}
          onLongPress={() => setSelectedMessageAction(item)}
          style={[
            styles.bubbleContainer,
            {
              backgroundColor: isOwn ? colors.primary : colors.surfaceElevated,
              borderTopLeftRadius: theme.radius.lg,
              borderTopRightRadius: theme.radius.lg,
              borderBottomLeftRadius: isOwn ? theme.radius.lg : 2,
              borderBottomRightRadius: isOwn ? 2 : theme.radius.lg,
            },
          ]}
        >
          {/* Sender Name in Group */}
          {!isOwn && conversation.type !== 'direct' && (
            <Typography variant="caption" color={colors.primary} bold style={{ marginBottom: 2 }}>
              {item.senderName}
            </Typography>
          )}

          {/* Forwarded Tag */}
          {item.forwardedFrom && (
            <Typography variant="caption" color={isOwn ? 'rgba(255,255,255,0.7)' : colors.textSecondary} style={{ marginBottom: 4, fontStyle: 'italic' }}>
              ↗️ Forwarded from {item.forwardedFrom}
            </Typography>
          )}

          {/* Quote Reply Banner */}
          {item.replyToMessage && (
            <View
              style={[
                styles.quoteReplyBox,
                {
                  backgroundColor: isOwn ? 'rgba(0,0,0,0.15)' : colors.background,
                  borderLeftColor: isOwn ? '#FFFFFF' : colors.primary,
                },
              ]}
            >
              <Typography variant="caption" color={isOwn ? '#FFFFFF' : colors.primary} bold>
                {item.replyToMessage.senderName}
              </Typography>
              <Typography variant="caption" color={isOwn ? 'rgba(255,255,255,0.85)' : colors.textSecondary} numberOfLines={1}>
                {item.replyToMessage.content}
              </Typography>
            </View>
          )}

          {/* Scheduled Tag */}
          {item.scheduledFor && (
            <View style={[styles.scheduledPill, { backgroundColor: isOwn ? 'rgba(0,0,0,0.2)' : colors.primaryLight }]}>
              <Typography variant="caption" color={isOwn ? '#FFFFFF' : colors.primary} bold>
                ⏰ Scheduled: {item.scheduledFor}
              </Typography>
            </View>
          )}

          {/* Message Content Render by Type */}
          {item.isDeleted ? (
            <Typography variant="body2" color={isOwn ? 'rgba(255,255,255,0.7)' : colors.textMuted} style={{ fontStyle: 'italic' }}>
              🚫 This message was deleted
            </Typography>
          ) : (
            <>
              {/* Type: Image */}
              {item.type === 'image' && item.mediaUrl && (
                <Image
                  source={{ uri: item.mediaUrl }}
                  style={[styles.mediaImagePreview, { borderRadius: theme.radius.md }]}
                  resizeMode="cover"
                />
              )}

              {/* Type: Video */}
              {item.type === 'video' && item.mediaUrl && (
                <View style={[styles.videoPreviewContainer, { borderRadius: theme.radius.md }]}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600' }}
                    style={styles.mediaImagePreview}
                    resizeMode="cover"
                  />
                  <View style={styles.videoPlayOverlay}>
                    <Typography variant="h2" color="#FFFFFF">
                      ▶
                    </Typography>
                  </View>
                </View>
              )}

              {/* Type: Voice Note / Audio */}
              {(item.type === 'voice' || item.type === 'audio') && (
                <View style={styles.voiceNoteRow}>
                  <TouchableOpacity style={styles.voicePlayBtn}>
                    <Typography variant="body1" color={isOwn ? '#FFFFFF' : colors.primary}>
                      ▶
                    </Typography>
                  </TouchableOpacity>
                  <View style={styles.voiceWaveform}>
                    <View style={[styles.waveformLine, { height: 12, backgroundColor: isOwn ? '#FFFFFF' : colors.primary }]} />
                    <View style={[styles.waveformLine, { height: 24, backgroundColor: isOwn ? '#FFFFFF' : colors.primary }]} />
                    <View style={[styles.waveformLine, { height: 16, backgroundColor: isOwn ? '#FFFFFF' : colors.primary }]} />
                    <View style={[styles.waveformLine, { height: 28, backgroundColor: isOwn ? '#FFFFFF' : colors.primary }]} />
                    <View style={[styles.waveformLine, { height: 18, backgroundColor: isOwn ? '#FFFFFF' : colors.primary }]} />
                    <View style={[styles.waveformLine, { height: 8, backgroundColor: isOwn ? '#FFFFFF' : colors.primary }]} />
                  </View>
                  <Typography variant="caption" color={isOwn ? '#FFFFFF' : colors.text} bold>
                    {item.voiceDuration || '0:14'}
                  </Typography>
                  <TouchableOpacity onPress={() => toggleVoiceSpeed(item.id)} style={styles.speedPill}>
                    <Typography variant="caption" color={isOwn ? '#FFFFFF' : colors.primary} bold>
                      {speed}x
                    </Typography>
                  </TouchableOpacity>
                </View>
              )}

              {/* Type: File */}
              {item.type === 'file' && (
                <View style={styles.fileRow}>
                  <Typography variant="h2">📄</Typography>
                  <View style={{ flex: 1 }}>
                    <Typography variant="subtitle2" color={isOwn ? '#FFFFFF' : colors.text} bold numberOfLines={1}>
                      {item.fileName || 'Architecture_Specs.pdf'}
                    </Typography>
                    <Typography variant="caption" color={isOwn ? 'rgba(255,255,255,0.8)' : colors.textSecondary}>
                      {item.fileSizeBytes ? `${(item.fileSizeBytes / 1024 / 1024).toFixed(1)} MB` : '1.4 MB'}
                    </Typography>
                  </View>
                  <Typography variant="caption" color={isOwn ? '#FFFFFF' : colors.primary} bold>
                    ⬇️
                  </Typography>
                </View>
              )}

              {/* Text Content */}
              {Boolean(item.content) && (
                <Typography
                  variant="body2"
                  color={isOwn ? '#FFFFFF' : colors.text}
                  style={styles.messageText}
                >
                  {item.content}
                </Typography>
              )}
            </>
          )}

          {/* Time & Delivery Status Footer */}
          <View style={styles.metaRow}>
            {item.isEdited && (
              <Typography variant="caption" color={isOwn ? 'rgba(255,255,255,0.7)' : colors.textMuted} style={{ fontSize: 10, marginRight: 4 }}>
                (edited)
              </Typography>
            )}
            <Typography variant="caption" color={isOwn ? 'rgba(255,255,255,0.75)' : colors.textMuted} style={{ fontSize: 10 }}>
              {item.createdAt}
            </Typography>

            {isOwn && (
              <Typography
                variant="caption"
                color={item.status === 'read' ? '#64D2FF' : 'rgba(255,255,255,0.8)'}
                style={{ fontSize: 10, marginLeft: 4 }}
              >
                {item.status === 'sending' ? '🕒' : item.status === 'sent' ? '✓' : item.status === 'delivered' ? '✓✓' : '✓✓'}
              </Typography>
            )}
          </View>

          {/* Emoji Reactions List */}
          {item.reactions && Object.keys(item.reactions).length > 0 && (
            <View style={styles.reactionsBadgeRow}>
              {Object.entries(item.reactions).map(([emoji, uids]) => (
                <TouchableOpacity
                  key={emoji}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (uids.includes('usr_meta_998')) {
                      removeReaction(conversationId, item.id, emoji);
                    } else {
                      addReaction(conversationId, item.id, emoji);
                    }
                  }}
                  style={[
                    styles.reactionBadge,
                    {
                      backgroundColor: uids.includes('usr_meta_998') ? colors.primaryLight : colors.surface,
                      borderColor: colors.borderSubtle,
                    },
                  ]}
                >
                  <Typography variant="caption">{emoji}</Typography>
                  {uids.length > 1 && (
                    <Typography variant="caption" color={colors.text} bold style={{ marginLeft: 2, fontSize: 10 }}>
                      {uids.length}
                    </Typography>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Top Chat Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.borderSubtle,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Typography variant="h3" color={colors.text}>
            {isRTL ? '➡️' : '⬅️'}
          </Typography>
        </TouchableOpacity>

        <Avatar
          uri={conversation.avatarUrl}
          name={conversation.title}
          size="sm"
          status={conversation.participants[0]?.isOnline ? 'online' : undefined}
        />

        <View style={styles.headerInfo}>
          <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1}>
            {conversation.title}
          </Typography>
          <Typography variant="caption" color={colors.success} style={{ fontSize: 11 }}>
            {conversation.participants[0]?.isOnline ? 'Active now 🟢' : 'Last seen recently'}
          </Typography>
        </View>

        {/* Audio & Video Calling Buttons */}
        <TouchableOpacity onPress={() => onStartCall(false)} style={styles.headerActionBtn}>
          <Typography variant="body1">📞</Typography>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onStartCall(true)} style={styles.headerActionBtn}>
          <Typography variant="body1">📹</Typography>
        </TouchableOpacity>
      </View>

      {/* Pinned Message Banner */}
      {pinnedMsg && (
        <View style={[styles.pinnedBanner, { backgroundColor: colors.surfaceElevated, borderBottomColor: colors.borderSubtle }]}>
          <Typography variant="caption" color={colors.primary} bold>
            📌 Pinned Message:
          </Typography>
          <Typography variant="caption" color={colors.text} numberOfLines={1} style={{ flex: 1, marginHorizontal: 8 }}>
            {pinnedMsg.content}
          </Typography>
          <TouchableOpacity onPress={() => unpinMessage(conversationId)}>
            <Typography variant="caption" color={colors.textMuted}>
              ✕
            </Typography>
          </TouchableOpacity>
        </View>
      )}

      {/* Messages FlatList */}
      <FlatList
        ref={flatListRef}
        data={messageList}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageBubble}
        contentContainerStyle={styles.messageListContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {typers.length > 0 && (
        <View style={styles.typingIndicatorRow}>
          <Typography variant="caption" color={colors.textSecondary} style={{ fontStyle: 'italic' }}>
            💬 {typers.join(', ')} is typing...
          </Typography>
        </View>
      )}

      {/* Quote Reply / Edit Message Header */}
      {(replyTarget || editingMessage) && (
        <View
          style={[
            styles.replyDraftBar,
            { backgroundColor: colors.surfaceElevated, borderTopColor: colors.borderSubtle },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Typography variant="caption" color={colors.primary} bold>
              {editingMessage ? '✏️ Editing Message' : `↩️ Replying to ${replyTarget?.senderName}`}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} numberOfLines={1}>
              {editingMessage ? editingMessage.content : replyTarget?.content}
            </Typography>
          </View>
          <TouchableOpacity
            onPress={() => {
              setReplyTarget(null);
              setEditingMessage(null);
              setInputText('');
            }}
          >
            <Typography variant="body1" color={colors.textMuted}>
              ✕
            </Typography>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Rich Input Bar */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.borderSubtle,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        {/* Attach Menu Button */}
        <TouchableOpacity
          onPress={() => setIsAttachMenuOpen(true)}
          style={styles.inputIconBtn}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Attach media"
        >
          <Typography variant="body1">📎</Typography>
        </TouchableOpacity>

        {/* Schedule Message Button */}
        <TouchableOpacity
          onPress={() => setIsScheduleModalOpen(true)}
          style={styles.inputIconBtn}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Schedule message"
        >
          <Typography variant="body1">⏰</Typography>
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderRadius: theme.radius.full,
              borderColor: colors.borderSubtle,
            },
          ]}
          placeholder="Message..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={(txt) => {
            setInputText(txt);
            setTyping(conversationId, 'Alex Rivera', txt.length > 0);
          }}
          multiline
        />

        {/* Send or Voice Record Button */}
        {inputText.trim().length > 0 ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSend}
            style={[styles.sendBtn, { backgroundColor: colors.primary }]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Typography variant="body2" color="#FFFFFF" bold>
              ⬆️
            </Typography>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSendVoice}
            style={[
              styles.sendBtn,
              { backgroundColor: isRecordingVoice ? '#FF3B30' : colors.surfaceElevated },
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Record voice note"
          >
            <Typography variant="body2">🎙️</Typography>
          </TouchableOpacity>
        )}
      </View>

      {/* Attach Media Action Bottom Sheet */}
      <BottomSheet
        visible={isAttachMenuOpen}
        onClose={() => setIsAttachMenuOpen(false)}
        title="Share Content"
      >
        <View style={styles.attachGrid}>
          <TouchableOpacity
            onPress={() =>
              handleSendMedia(
                'image',
                'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
                'High-res system architecture diagram'
              )
            }
            style={styles.attachItem}
          >
            <View style={[styles.attachIconCircle, { backgroundColor: '#FF2D55' }]}>
              <Typography variant="h2">📷</Typography>
            </View>
            <Typography variant="caption" color={colors.text} bold>
              Photos
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              handleSendMedia(
                'video',
                'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
                'Screen capture demonstration'
              )
            }
            style={styles.attachItem}
          >
            <View style={[styles.attachIconCircle, { backgroundColor: '#AF52DE' }]}>
              <Typography variant="h2">🎥</Typography>
            </View>
            <Typography variant="caption" color={colors.text} bold>
              Video
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              handleSendMedia(
                'file',
                'https://example.com/spec.pdf',
                'Engineering_RFC_2026.pdf',
                { fileName: 'Engineering_RFC_2026.pdf', fileSizeBytes: 1450000 }
              )
            }
            style={styles.attachItem}
          >
            <View style={[styles.attachIconCircle, { backgroundColor: '#0A84FF' }]}>
              <Typography variant="h2">📄</Typography>
            </View>
            <Typography variant="caption" color={colors.text} bold>
              Document
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              handleSendMedia(
                'gif',
                'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif',
                'Celebration GIF 🎉'
              )
            }
            style={styles.attachItem}
          >
            <View style={[styles.attachIconCircle, { backgroundColor: '#34C759' }]}>
              <Typography variant="h2">🎆</Typography>
            </View>
            <Typography variant="caption" color={colors.text} bold>
              GIF
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              handleSendMedia(
                'sticker',
                'https://example.com/sticker1.png',
                '🚀 Launch Ready'
              )
            }
            style={styles.attachItem}
          >
            <View style={[styles.attachIconCircle, { backgroundColor: '#FF9500' }]}>
              <Typography variant="h2">🏷️</Typography>
            </View>
            <Typography variant="caption" color={colors.text} bold>
              Sticker
            </Typography>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      {/* Message Long-Press Actions Bottom Sheet */}
      <BottomSheet
        visible={Boolean(selectedMessageAction)}
        onClose={() => setSelectedMessageAction(null)}
        title="Message Options"
      >
        {selectedMessageAction && (
          <View style={styles.actionSheetContent}>
            {/* Quick Emoji Reactions */}
            <View style={styles.emojiReactionRow}>
              {EMOJI_REACTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => {
                    addReaction(conversationId, selectedMessageAction.id, emoji);
                    setSelectedMessageAction(null);
                  }}
                  style={styles.emojiBtn}
                >
                  <Typography style={{ fontSize: 24 }}>{emoji}</Typography>
                </TouchableOpacity>
              ))}
            </View>

            {/* Reply */}
            <TouchableOpacity
              onPress={() => {
                setReplyTarget(selectedMessageAction);
                setSelectedMessageAction(null);
              }}
              style={styles.actionOptionRow}
            >
              <Typography variant="body1">↩️ Reply</Typography>
            </TouchableOpacity>

            {/* Edit (if own message) */}
            {selectedMessageAction.senderId === 'usr_meta_998' && selectedMessageAction.type === 'text' && (
              <TouchableOpacity
                onPress={() => {
                  setEditingMessage(selectedMessageAction);
                  setInputText(selectedMessageAction.content);
                  setSelectedMessageAction(null);
                }}
                style={styles.actionOptionRow}
              >
                <Typography variant="body1">✏️ Edit Message</Typography>
              </TouchableOpacity>
            )}

            {/* Pin / Unpin */}
            <TouchableOpacity
              onPress={() => {
                if (selectedMessageAction.isPinned) {
                  unpinMessage(conversationId);
                } else {
                  pinMessage(conversationId, selectedMessageAction.id);
                  showToast({ message: 'Message pinned! 📌', type: 'info' });
                }
                setSelectedMessageAction(null);
              }}
              style={styles.actionOptionRow}
            >
              <Typography variant="body1">
                {selectedMessageAction.isPinned ? '📌 Unpin Message' : '📌 Pin Message'}
              </Typography>
            </TouchableOpacity>

            {/* Forward */}
            <TouchableOpacity
              onPress={() => {
                setForwardTargetMsg(selectedMessageAction);
                setSelectedMessageAction(null);
              }}
              style={styles.actionOptionRow}
            >
              <Typography variant="body1">↗️ Forward</Typography>
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity
              onPress={() => {
                deleteMessage(
                  conversationId,
                  selectedMessageAction.id,
                  selectedMessageAction.senderId === 'usr_meta_998' ? 'everyone' : 'me'
                );
                setSelectedMessageAction(null);
                showToast({ message: 'Message deleted', type: 'info' });
              }}
              style={styles.actionOptionRow}
            >
              <Typography variant="body1" color="#FF3B30">
                🗑️ Delete Message
              </Typography>
            </TouchableOpacity>
          </View>
        )}
      </BottomSheet>

      {/* Forward Message Modal */}
      <ForwardMessageModal
        visible={Boolean(forwardTargetMsg)}
        message={forwardTargetMsg}
        onClose={() => setForwardTargetMsg(null)}
      />

      {/* Schedule Message Modal */}
      <ScheduleMessageModal
        visible={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onConfirmSchedule={handleConfirmSchedule}
      />
    </KeyboardAvoidingView>
  );
};

export const ChatRoomScreen = memo(ChatRoomScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
  },
  headerActionBtn: {
    padding: 6,
  },
  pinnedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  messageListContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  messageRowWrapper: {
    marginVertical: 3,
    alignItems: 'flex-end',
  },
  bubbleContainer: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'relative',
  },
  messageText: {
    lineHeight: 19,
  },
  mediaImagePreview: {
    width: 220,
    height: 150,
    marginBottom: 6,
  },
  videoPreviewContainer: {
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 6,
  },
  videoPlayOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  voicePlayBtn: {
    padding: 4,
  },
  voiceWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  waveformLine: {
    width: 3,
    borderRadius: 1.5,
  },
  speedPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  quoteReplyBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderLeftWidth: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  scheduledPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  reactionsBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  typingIndicatorRow: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  replyDraftBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  inputIconBtn: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 12,
    gap: 16,
  },
  attachItem: {
    alignItems: 'center',
    gap: 6,
    width: 60,
  },
  attachIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSheetContent: {
    paddingVertical: 8,
    gap: 8,
  },
  emojiReactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 14,
    marginBottom: 8,
  },
  emojiBtn: {
    padding: 4,
  },
  actionOptionRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
});

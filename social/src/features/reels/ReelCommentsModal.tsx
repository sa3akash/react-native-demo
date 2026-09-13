import React, { useState, memo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, BottomSheet, Input, Button } from '../../shared/components';
import { useAuthStore } from '../../store/useAuthStore';

export interface ReelCommentItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface ReelCommentsModalProps {
  visible: boolean;
  reelId: string | null;
  onClose: () => void;
}

const ReelCommentsModalComponent: React.FC<ReelCommentsModalProps> = ({
  visible,
  reelId,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const isRTL = I18nManager.isRTL;

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<ReelCommentItem[]>([
    {
      id: 'rc_1',
      authorName: 'David Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      content: 'This 120 FPS gesture physics is buttery smooth! Is it open source?',
      createdAt: '10m ago',
      likesCount: 24,
      isLiked: true,
    },
    {
      id: 'rc_2',
      authorName: 'Sarah Jenkins',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      content: 'Fabric TurboModules make a massive difference for zero-copy UI updates 🔥',
      createdAt: '5m ago',
      likesCount: 12,
      isLiked: false,
    },
  ]);

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    const newComment: ReelCommentItem = {
      id: `rc_${Date.now()}`,
      authorName: user?.name || 'Alex Rivera',
      authorAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      content: commentText.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleToggleLikeComment = (id: string) => {
    setComments(
      comments.map((c) =>
        c.id === id ? { ...c, isLiked: !c.isLiked, likesCount: c.likesCount + (c.isLiked ? -1 : 1) } : c
      )
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={`Comments (${comments.length})`} maxHeight="80%">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.commentRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Avatar uri={item.authorAvatar} name={item.authorName} size="sm" />
              <View style={[styles.bubble, { backgroundColor: colors.inputBg, borderRadius: theme.radius.md }]}>
                <Typography variant="subtitle2" color={colors.text} bold>
                  {item.authorName}
                </Typography>
                <Typography variant="body2" color={colors.text} style={styles.commentText}>
                  {item.content}
                </Typography>
                <Typography variant="caption" color={colors.textMuted}>
                  {item.createdAt}
                </Typography>
              </View>

              <TouchableOpacity
                onPress={() => handleToggleLikeComment(item.id)}
                style={styles.likeBtn}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Like comment"
              >
                <Typography variant="body2" color={item.isLiked ? colors.danger : colors.textMuted}>
                  {item.isLiked ? '❤️' : '🤍'}
                </Typography>
                {item.likesCount > 0 && (
                  <Typography variant="caption" color={colors.textMuted}>
                    {item.likesCount}
                  </Typography>
                )}
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Input Bar */}
        <View style={[styles.inputRow, { borderTopColor: colors.borderSubtle, backgroundColor: colors.surface }]}>
          <Avatar uri={user?.avatarUrl} name={user?.name || 'Alex'} size="sm" />
          <View style={styles.inputFlex}>
            <Input
              placeholder="Add a comment on this reel..."
              value={commentText}
              onChangeText={setCommentText}
            />
          </View>
          <Button
            label="Post"
            size="sm"
            variant="primary"
            disabled={!commentText.trim()}
            onPress={handleSendComment}
          />
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

export const ReelCommentsModal = memo(ReelCommentsModalComponent);

const styles = StyleSheet.create({
  container: {
    height: 440,
  },
  listContent: {
    paddingBottom: 16,
  },
  commentRow: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bubble: {
    marginLeft: 10,
    flex: 1,
    padding: 10,
  },
  commentText: {
    marginTop: 2,
    marginBottom: 4,
  },
  likeBtn: {
    alignItems: 'center',
    marginLeft: 8,
    padding: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  inputFlex: {
    flex: 1,
  },
});

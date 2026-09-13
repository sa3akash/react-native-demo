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
import { useFeedStore, PostComment } from '../../store/useFeedStore';
import { useAuthStore } from '../../store/useAuthStore';

export interface CommentsModalProps {
  visible: boolean;
  postId: string | null;
  onClose: () => void;
}

const CommentsModalComponent: React.FC<CommentsModalProps> = ({
  visible,
  postId,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const commentsMap = useFeedStore((state) => state.comments);
  const addComment = useFeedStore((state) => state.addComment);
  const addCommentReply = useFeedStore((state) => state.addCommentReply);
  const likeComment = useFeedStore((state) => state.likeComment);

  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; authorName: string } | null>(null);

  const currentComments: PostComment[] = postId ? commentsMap[postId] || [] : [];
  const isRTL = I18nManager.isRTL;

  const handleSend = () => {
    if (!commentText.trim() || !postId) return;

    if (replyingTo) {
      addCommentReply(postId, replyingTo.id, {
        postId,
        authorId: user?.id || 'usr_meta_998',
        authorName: user?.name || 'Alex Rivera',
        authorAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        content: commentText.trim(),
      });
      setReplyingTo(null);
    } else {
      addComment(postId, {
        postId,
        authorId: user?.id || 'usr_meta_998',
        authorName: user?.name || 'Alex Rivera',
        authorAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        content: commentText.trim(),
      });
    }

    setCommentText('');
  };

  const handleStartReply = (comment: PostComment) => {
    setReplyingTo({ id: comment.id, authorName: comment.authorName });
    setCommentText(`@${comment.authorName} `);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Comments" maxHeight="85%">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <FlatList
          data={currentComments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <View style={[styles.commentRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Avatar uri={item.authorAvatar} name={item.authorName} size="sm" />
                <View style={[styles.commentBubble, { backgroundColor: colors.inputBg, borderRadius: theme.radius.md }]}>
                  <Typography variant="subtitle2" color={colors.text} bold>
                    {item.authorName}
                  </Typography>
                  <Typography variant="body2" color={colors.text} style={styles.commentBody}>
                    {item.content}
                  </Typography>
                  <View style={styles.metaRow}>
                    <Typography variant="caption" color={colors.textMuted}>
                      {item.createdAt}
                    </Typography>
                    <TouchableOpacity onPress={() => handleStartReply(item)} style={styles.replyActionBtn}>
                      <Typography variant="caption" color={colors.primary} bold>
                        Reply
                      </Typography>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Like Comment Heart Button */}
                <TouchableOpacity
                  onPress={() => postId && likeComment(postId, item.id)}
                  style={styles.likeCommentBtn}
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

              {/* Nested Replies */}
              {item.replies && item.replies.length > 0 && (
                <View style={styles.repliesList}>
                  {item.replies.map((reply) => (
                    <View key={reply.id} style={[styles.replyRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <Avatar uri={reply.authorAvatar} name={reply.authorName} size="xs" />
                      <View style={[styles.commentBubble, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.md }]}>
                        <Typography variant="subtitle2" color={colors.text} bold>
                          {reply.authorName}
                        </Typography>
                        <Typography variant="body2" color={colors.text} style={styles.commentBody}>
                          {reply.content}
                        </Typography>
                        <Typography variant="caption" color={colors.textMuted}>
                          {reply.createdAt}
                        </Typography>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography variant="body2" color={colors.textSecondary}>
                No comments yet. Be the first to share your thoughts! 💬
              </Typography>
            </View>
          }
        />

        {/* Replying banner */}
        {replyingTo && (
          <View style={[styles.replyingBanner, { backgroundColor: colors.primaryLight }]}>
            <Typography variant="caption" color={colors.primary} bold>
              Replying to @{replyingTo.authorName}
            </Typography>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <Typography variant="caption" color={colors.danger} bold>
                ✕ Cancel
              </Typography>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Bar */}
        <View style={[styles.inputRow, { borderTopColor: colors.borderSubtle, backgroundColor: colors.surface }]}>
          <Avatar uri={user?.avatarUrl} name={user?.name || 'Alex'} size="sm" />
          <View style={styles.inputFlex}>
            <Input
              placeholder={replyingTo ? `Reply to @${replyingTo.authorName}...` : 'Write a comment...'}
              value={commentText}
              onChangeText={setCommentText}
            />
          </View>
          <Button
            label="Send"
            size="sm"
            variant="primary"
            disabled={!commentText.trim()}
            onPress={handleSend}
          />
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

export const CommentsModal = memo(CommentsModalComponent);

const styles = StyleSheet.create({
  container: {
    height: 480,
  },
  listContent: {
    paddingBottom: 16,
  },
  commentItem: {
    marginBottom: 12,
  },
  commentRow: {
    alignItems: 'flex-start',
  },
  commentBubble: {
    marginLeft: 10,
    flex: 1,
    padding: 10,
  },
  commentBody: {
    marginTop: 2,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  replyActionBtn: {
    padding: 2,
  },
  likeCommentBtn: {
    alignItems: 'center',
    marginLeft: 8,
    padding: 4,
  },
  repliesList: {
    marginLeft: 36,
    marginTop: 6,
    gap: 6,
  },
  replyRow: {
    alignItems: 'flex-start',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  replyingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
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

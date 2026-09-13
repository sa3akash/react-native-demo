import React, { useState, memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, BottomSheet, Input, Button } from '../../shared/components';
import { useFeedStore, PostModel } from '../../store/useFeedStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface RepostModalProps {
  visible: boolean;
  post: PostModel | null;
  onClose: () => void;
}

const RepostModalComponent: React.FC<RepostModalProps> = ({
  visible,
  post,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const repostPost = useFeedStore((state) => state.repostPost);
  const { showToast } = useToast();
  const isRTL = I18nManager.isRTL;

  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteText, setQuoteText] = useState('');

  const handleInstantRepost = () => {
    if (!post) return;
    repostPost(post.id);
    showToast({ message: 'Reposted to your feed! 🔄', type: 'success' });
    onClose();
  };

  const handleQuoteSubmit = () => {
    if (!post) return;
    repostPost(post.id, quoteText.trim());
    showToast({ message: 'Quote post published! ✍️', type: 'success' });
    setQuoteText('');
    setIsQuoting(false);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Repost Post">
      <View style={styles.content}>
        {!isQuoting ? (
          <>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleInstantRepost}
              style={[styles.actionOption, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Instant repost"
            >
              <Typography variant="h3" style={styles.icon}>
                🔄
              </Typography>
              <View style={styles.optionTextCol}>
                <Typography variant="subtitle1" color={colors.text} bold>
                  Instant Repost
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  Instantly amplify this post to your followers.
                </Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsQuoting(true)}
              style={[styles.actionOption, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Quote post"
            >
              <Typography variant="h3" style={styles.icon}>
                ✍️
              </Typography>
              <View style={styles.optionTextCol}>
                <Typography variant="subtitle1" color={colors.text} bold>
                  Quote Post
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  Add your own thoughts and perspectives before sharing.
                </Typography>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.quoteContainer}>
            <Input
              placeholder="Add your commentary..."
              value={quoteText}
              onChangeText={setQuoteText}
              autoFocus
            />

            {/* Embedded Post Preview */}
            {post && (
              <View style={[styles.quotedPostCard, { backgroundColor: colors.inputBg, borderColor: colors.borderSubtle, borderRadius: theme.radius.md }]}>
                <Typography variant="caption" color={colors.primary} bold>
                  @{post.authorName}
                </Typography>
                <Typography variant="body2" color={colors.text} numberOfLines={2} style={styles.quotedText}>
                  {post.content}
                </Typography>
              </View>
            )}

            <View style={styles.quoteActions}>
              <Button label="Cancel" variant="ghost" size="sm" onPress={() => setIsQuoting(false)} />
              <Button
                label="Post Quote"
                variant="primary"
                size="sm"
                disabled={!quoteText.trim()}
                onPress={handleQuoteSubmit}
              />
            </View>
          </View>
        )}
      </View>
    </BottomSheet>
  );
};

export const RepostModal = memo(RepostModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 12,
  },
  actionOption: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 14,
  },
  optionTextCol: {
    flex: 1,
  },
  quoteContainer: {
    paddingVertical: 6,
  },
  quotedPostCard: {
    padding: 12,
    borderWidth: 1,
    marginVertical: 10,
  },
  quotedText: {
    marginTop: 4,
  },
  quoteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
});

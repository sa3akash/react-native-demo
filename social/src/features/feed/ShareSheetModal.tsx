import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Share,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, BottomSheet } from '../../shared/components';
import { PostModel } from '../../store/useFeedStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface ShareSheetModalProps {
  visible: boolean;
  post: PostModel | null;
  onClose: () => void;
  onRepostPress?: () => void;
}

const ShareSheetModalComponent: React.FC<ShareSheetModalProps> = ({
  visible,
  post,
  onClose,
  onRepostPress,
}) => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const isRTL = I18nManager.isRTL;

  const handleCopyLink = () => {
    showToast({ message: 'Post link copied to clipboard! 📋', type: 'success' });
    onClose();
  };

  const handleShareToStory = () => {
    showToast({ message: 'Post attached to your new story draft! ✨', type: 'success' });
    onClose();
  };

  const handleSendDM = () => {
    showToast({ message: 'Select contact to send direct message...', type: 'info' });
    onClose();
  };

  const handleNativeShare = async () => {
    if (!post) return;
    try {
      await Share.share({
        message: `${post.content}\n\nShared via SocialSphere: https://socialsphere.io/p/${post.id}`,
        title: `Post by ${post.authorName}`,
      });
      onClose();
    } catch {
      // Ignored
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Share Post">
      <View style={styles.content}>
        {/* Share to Story */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleShareToStory}
          style={[styles.shareItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Share to story"
        >
          <Typography variant="h3" style={styles.icon}>
            ⭐
          </Typography>
          <View style={styles.textCol}>
            <Typography variant="subtitle1" color={colors.text} bold>
              Add Post to Your Story
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Share with your story viewers for 24 hours.
            </Typography>
          </View>
        </TouchableOpacity>

        {/* Repost Shortcut */}
        {onRepostPress && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              onClose();
              onRepostPress();
            }}
            style={[styles.shareItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Repost"
          >
            <Typography variant="h3" style={styles.icon}>
              🔄
            </Typography>
            <View style={styles.textCol}>
              <Typography variant="subtitle1" color={colors.text} bold>
                Repost / Quote Post
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Broadcast to your followers timeline.
              </Typography>
            </View>
          </TouchableOpacity>
        )}

        {/* Send in Direct Message */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSendDM}
          style={[styles.shareItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Send in direct message"
        >
          <Typography variant="h3" style={styles.icon}>
            ✉️
          </Typography>
          <View style={styles.textCol}>
            <Typography variant="subtitle1" color={colors.text} bold>
              Send via Direct Message
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Share privately with a friend or group.
            </Typography>
          </View>
        </TouchableOpacity>

        {/* Copy Link */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCopyLink}
          style={[styles.shareItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Copy link"
        >
          <Typography variant="h3" style={styles.icon}>
            📋
          </Typography>
          <View style={styles.textCol}>
            <Typography variant="subtitle1" color={colors.text} bold>
              Copy Link to Post
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Copy shareable URL to clipboard.
            </Typography>
          </View>
        </TouchableOpacity>

        {/* Native System Share */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleNativeShare}
          style={[styles.shareItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="More sharing options"
        >
          <Typography variant="h3" style={styles.icon}>
            📤
          </Typography>
          <View style={styles.textCol}>
            <Typography variant="subtitle1" color={colors.text} bold>
              More Options (System Share)
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Share via WhatsApp, Messages, Email, and AirDrop.
            </Typography>
          </View>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export const ShareSheetModal = memo(ShareSheetModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 10,
  },
  shareItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 14,
  },
  textCol: {
    flex: 1,
  },
});

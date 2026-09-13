import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, BottomSheet } from '../../shared/components';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface UserModerationModalProps {
  visible: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
  };
}

const UserModerationModalComponent: React.FC<UserModerationModalProps> = ({
  visible,
  onClose,
  targetUser,
}) => {
  const { colors } = useTheme();
  const { blockUser, muteUser, restrictUser } = useAuthStore();
  const { showToast } = useToast();
  const isRTL = I18nManager.isRTL;

  const handleBlock = () => {
    blockUser({
      id: targetUser.id,
      name: targetUser.name,
      username: targetUser.username,
      avatarUrl: targetUser.avatarUrl,
    });
    showToast({ message: `Blocked @${targetUser.username}`, type: 'danger' });
    onClose();
  };

  const handleMute = () => {
    muteUser({
      id: targetUser.id,
      name: targetUser.name,
      username: targetUser.username,
      avatarUrl: targetUser.avatarUrl,
    });
    showToast({ message: `Muted @${targetUser.username}`, type: 'info' });
    onClose();
  };

  const handleRestrict = () => {
    restrictUser({
      id: targetUser.id,
      name: targetUser.name,
      username: targetUser.username,
      avatarUrl: targetUser.avatarUrl,
    });
    showToast({ message: `Restricted @${targetUser.username}`, type: 'warning' });
    onClose();
  };

  const handleReport = () => {
    showToast({ message: `Report submitted for @${targetUser.username}. Our trust & safety team will review it.`, type: 'success' });
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={`Manage @${targetUser.username}`}>
      <View style={styles.content}>
        {/* Restrict Option */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleRestrict}
          style={[styles.optionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Restrict user"
        >
          <Typography variant="h3" style={styles.icon}>
            ⚠️
          </Typography>
          <View style={styles.optionTextCol}>
            <Typography variant="subtitle2" color={colors.text} bold>
              Restrict Account
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Limit unwanted interactions without letting them know.
            </Typography>
          </View>
        </TouchableOpacity>

        {/* Mute Option */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleMute}
          style={[styles.optionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Mute user"
        >
          <Typography variant="h3" style={styles.icon}>
            🔇
          </Typography>
          <View style={styles.optionTextCol}>
            <Typography variant="subtitle2" color={colors.text} bold>
              Mute Posts & Stories
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Hide their content from your feed without unfollowing.
            </Typography>
          </View>
        </TouchableOpacity>

        {/* Block Option */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBlock}
          style={[styles.optionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Block user"
        >
          <Typography variant="h3" style={styles.icon}>
            🚫
          </Typography>
          <View style={styles.optionTextCol}>
            <Typography variant="subtitle2" color={colors.danger} bold>
              Block User
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              They will not be able to find your profile, posts, or story on SocialSphere.
            </Typography>
          </View>
        </TouchableOpacity>

        {/* Report Option */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleReport}
          style={[styles.optionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Report user"
        >
          <Typography variant="h3" style={styles.icon}>
            🚩
          </Typography>
          <View style={styles.optionTextCol}>
            <Typography variant="subtitle2" color={colors.danger} bold>
              Report Account
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Flag harassment, impersonation, hate speech, or spam.
            </Typography>
          </View>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export const UserModerationModal = memo(UserModerationModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 12,
  },
  optionRow: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 14,
  },
  optionTextCol: {
    flex: 1,
  },
});

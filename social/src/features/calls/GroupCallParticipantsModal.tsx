import React, { memo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, BottomSheet, Button } from '../../shared/components';
import { useCallStore, CallParticipant } from '../../store/useCallStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface GroupCallParticipantsModalProps {
  visible: boolean;
  onClose: () => void;
}

const GroupCallParticipantsModalComponent: React.FC<GroupCallParticipantsModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const participants = useCallStore((state) => state.participants);
  const activeCallId = useCallStore((state) => state.activeCallId);
  const { showToast } = useToast();

  const handleInvite = async () => {
    try {
      await Share.share({
        message: `Join our SocialSphere HD WebRTC conference: https://socialsphere.io/call/${activeCallId}`,
        title: 'Join Call',
      });
    } catch {
      // Ignored
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={`Participants (${participants.length + 1})`}>
      <View style={styles.content}>
        {/* Local user row */}
        <View style={[styles.participantRow, { borderBottomColor: colors.borderSubtle }]}>
          <Avatar uri="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400" name="You (Alex)" size="md" />
          <View style={{ flex: 1 }}>
            <Typography variant="subtitle2" color={colors.text} bold>
              You (Alex Rivera)
            </Typography>
            <Typography variant="caption" color={colors.primary}>
              Host • 5G (Excellent)
            </Typography>
          </View>
          <Typography variant="body2">🎙️</Typography>
        </View>

        {/* Remote participants list */}
        <FlatList
          data={participants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.participantRow, { borderBottomColor: colors.borderSubtle }]}>
              <Avatar uri={item.avatarUrl} name={item.name} size="md" />
              <View style={{ flex: 1 }}>
                <Typography variant="subtitle2" color={colors.text} bold>
                  {item.name}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  Signal: {'📶'.repeat(Math.min(item.networkQuality, 4))}
                </Typography>
              </View>
              <View style={styles.iconGroup}>
                <Typography variant="body2">{item.isMuted ? '🔇' : '🎙️'}</Typography>
                <Typography variant="body2">{item.isCameraOff ? '🚫' : '📹'}</Typography>
              </View>
            </View>
          )}
        />

        <Button
          label="🔗 Invite Others to Call"
          variant="primary"
          size="lg"
          onPress={handleInvite}
          fullWidth
          style={{ marginTop: 12 }}
        />
      </View>
    </BottomSheet>
  );
};

export const GroupCallParticipantsModal = memo(GroupCallParticipantsModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    maxHeight: 380,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

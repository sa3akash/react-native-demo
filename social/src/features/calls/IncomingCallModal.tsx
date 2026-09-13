import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar } from '../../shared/components';
import { useCallStore } from '../../store/useCallStore';

export interface IncomingCallModalProps {
  visible: boolean;
  callerName: string;
  callerAvatar: string;
  callType: 'audio' | 'video';
  onAnswer: () => void;
  onDecline: () => void;
}

const IncomingCallModalComponent: React.FC<IncomingCallModalProps> = ({
  visible,
  callerName,
  callerAvatar,
  callType,
  onAnswer,
  onDecline,
}) => {
  const { colors, theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={[styles.callCard, { backgroundColor: '#1C1C1E', borderRadius: theme.radius.xl }]}>
          {/* Header Tag */}
          <View style={styles.tagPill}>
            <Typography variant="caption" color="#FFFFFF" bold>
              {callType === 'video' ? '📹 INCOMING HD VIDEO CALL' : '📞 INCOMING VOICE CALL'}
            </Typography>
          </View>

          {/* Caller Avatar */}
          <View style={styles.avatarSection}>
            <Avatar uri={callerAvatar} name={callerName} size="lg" />
            <Typography variant="h3" color="#FFFFFF" bold style={{ marginTop: 12 }}>
              {callerName}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.7)" style={{ marginTop: 4 }}>
              SocialSphere Encrypted Call
            </Typography>
          </View>

          {/* Action Buttons: Decline & Answer */}
          <View style={styles.actionsRow}>
            {/* Decline */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onDecline}
              style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Decline incoming call"
            >
              <Typography variant="h2" color="#FFFFFF">
                ✕
              </Typography>
              <Typography variant="caption" color="#FFFFFF" bold>
                Decline
              </Typography>
            </TouchableOpacity>

            {/* Answer */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onAnswer}
              style={[styles.actionBtn, { backgroundColor: '#34C759' }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Answer incoming call"
            >
              <Typography variant="h2" color="#FFFFFF">
                {callType === 'video' ? '📹' : '📞'}
              </Typography>
              <Typography variant="caption" color="#FFFFFF" bold>
                Answer
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const IncomingCallModal = memo(IncomingCallModalComponent);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  callCard: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    alignItems: 'center',
  },
  tagPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});

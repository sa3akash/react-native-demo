import React, { memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, BottomSheet, Avatar, Button } from '../../shared/components';
import { useLiveStreamStore } from '../../store/useLiveStreamStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface MultiGuestModalProps {
  visible: boolean;
  onClose: () => void;
}

const MultiGuestModalComponent: React.FC<MultiGuestModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const coHosts = useLiveStreamStore((state) => state.coHosts);
  const pendingRequests = useLiveStreamStore((state) => state.pendingGuestRequests);
  const acceptRequest = useLiveStreamStore((state) => state.acceptGuestRequest);
  const declineRequest = useLiveStreamStore((state) => state.declineGuestRequest);
  const removeCoHost = useLiveStreamStore((state) => state.removeCoHost);
  const toggleMuteCoHost = useLiveStreamStore((state) => state.toggleMuteCoHost);
  const { showToast } = useToast();

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Multi-Guest Co-Hosting (4 Max) 👥">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Active Co-Hosts List */}
        <Typography variant="subtitle2" color={colors.text} bold>
          Active Co-Hosts ({coHosts.length}/4)
        </Typography>
        <View style={styles.listSection}>
          {coHosts.map((host) => (
            <View
              key={host.id}
              style={[styles.hostRow, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.md }]}
            >
              <Avatar uri={host.avatarUrl} name={host.name} size="md" />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Typography variant="subtitle2" color={colors.text} bold>
                  {host.name} {host.role === 'host' ? '(Primary Host 👑)' : '(Co-Host)'}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  {host.isMuted ? '🔇 Microphone Muted' : '🎙️ Live Audio Connected'}
                </Typography>
              </View>

              {host.role !== 'host' && (
                <View style={styles.actionBtnGroup}>
                  <TouchableOpacity
                    onPress={() => toggleMuteCoHost(host.id)}
                    style={styles.actionBtn}
                  >
                    <Typography variant="body2">{host.isMuted ? '🔊' : '🔇'}</Typography>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      removeCoHost(host.id);
                      showToast({ message: `${host.name} removed from stream`, type: 'info' });
                    }}
                    style={styles.actionBtn}
                  >
                    <Typography variant="body2">🚫</Typography>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Pending Viewer Join Requests */}
        <Typography variant="subtitle2" color={colors.text} bold style={{ marginTop: 12 }}>
          Viewer Join Requests ({pendingRequests.length})
        </Typography>
        <View style={styles.listSection}>
          {pendingRequests.length === 0 ? (
            <Typography variant="caption" color={colors.textSecondary} style={{ paddingVertical: 8 }}>
              No pending viewer co-host requests right now.
            </Typography>
          ) : (
            pendingRequests.map((req) => (
              <View
                key={req.id}
                style={[styles.reqRow, { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderRadius: theme.radius.md }]}
              >
                <Avatar uri={req.userAvatar} name={req.userName} size="md" />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Typography variant="subtitle2" color={colors.text} bold>
                    {req.userName}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary}>
                    Wants to join broadcast
                  </Typography>
                </View>

                <View style={styles.reqBtnGroup}>
                  <Button
                    label="Decline"
                    variant="ghost"
                    size="sm"
                    onPress={() => declineRequest(req.id)}
                  />
                  <Button
                    label="Accept"
                    variant="primary"
                    size="sm"
                    onPress={() => {
                      acceptRequest(req.id);
                      showToast({ message: `${req.userName} joined as co-host! 🎉`, type: 'success' });
                    }}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export const MultiGuestModal = memo(MultiGuestModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 8,
  },
  listSection: {
    gap: 8,
    marginVertical: 4,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  actionBtnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 6,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
  },
  reqBtnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
});

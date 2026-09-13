import React, { memo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert as RNAlert,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Card, Button } from '../../shared/components';
import { useAuthStore, ActiveSession } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface DeviceManagementScreenProps {
  onBack?: () => void;
}

const DeviceManagementScreenComponent: React.FC<DeviceManagementScreenProps> = ({ onBack }) => {
  const { colors, theme } = useTheme();
  const { activeSessions, terminateSession, terminateAllOtherSessions } = useAuthStore();
  const { showToast } = useToast();

  const handleRevokeSession = (session: ActiveSession) => {
    if (session.isCurrent) {
      showToast({ message: "You cannot terminate your current active device session here.", type: 'warning' });
      return;
    }

    terminateSession(session.id);
    showToast({ message: `Session revoked for ${session.deviceName}`, type: 'info' });
  };

  const handleLogoutAllOther = () => {
    terminateAllOtherSessions();
    showToast({ message: 'All other active sessions have been terminated. 🛡️', type: 'success' });
  };

  const getDeviceIcon = (type: ActiveSession['deviceType']) => {
    switch (type) {
      case 'ios':
        return '📱';
      case 'android':
        return '🤖';
      case 'web':
        return '🌐';
      case 'desktop':
        return '💻';
      default:
        return '📱';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Typography variant="h3" color={colors.text}>
              ←
            </Typography>
          </TouchableOpacity>
        )}
        <Typography variant="h3" color={colors.text} bold>
          Device Management
        </Typography>
        <View style={{ width: 32 }} />
      </View>

      {/* Info Card */}
      <View style={styles.topInfo}>
        <Typography variant="body2" color={colors.textSecondary}>
          These devices are currently signed in to your SocialSphere account. If you recognize an unfamiliar device or location, terminate the session immediately.
        </Typography>
      </View>

      {/* Sessions List */}
      <FlatList
        data={activeSessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          return (
            <Card
              variant={item.isCurrent ? 'elevated' : 'flat'}
              padding={16}
              style={[
                styles.sessionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: item.isCurrent ? colors.primary : colors.borderSubtle,
                },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.deviceInfoRow}>
                  <Typography variant="h2" style={styles.deviceIcon}>
                    {getDeviceIcon(item.deviceType)}
                  </Typography>
                  <View style={styles.deviceTextCol}>
                    <View style={styles.nameRow}>
                      <Typography variant="subtitle1" color={colors.text} bold>
                        {item.deviceName}
                      </Typography>
                      {item.isCurrent && (
                        <View style={[styles.currentBadge, { backgroundColor: colors.successBg }]}>
                          <Typography variant="caption" color={colors.success} bold>
                            THIS DEVICE
                          </Typography>
                        </View>
                      )}
                    </View>
                    <Typography variant="caption" color={colors.textSecondary}>
                      📍 {item.location} • {item.ipAddress}
                    </Typography>
                    <Typography variant="caption" color={colors.textMuted} style={styles.timeText}>
                      Last active: {item.lastActive}
                    </Typography>
                  </View>
                </View>

                {!item.isCurrent && (
                  <TouchableOpacity
                    onPress={() => handleRevokeSession(item)}
                    style={styles.revokeBtn}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Revoke session for ${item.deviceName}`}
                  >
                    <Typography variant="buttonSmall" color={colors.danger} bold>
                      Revoke
                    </Typography>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          );
        }}
        ListFooterComponent={
          activeSessions.length > 1 ? (
            <View style={styles.footerWrap}>
              <Button
                label="Log Out All Other Devices"
                variant="danger"
                onPress={handleLogoutAllOther}
                fullWidth
                size="md"
              />
            </View>
          ) : undefined
        }
      />
    </SafeAreaView>
  );
};

export const DeviceManagementScreen = memo(DeviceManagementScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    padding: 6,
  },
  topInfo: {
    padding: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  sessionCard: {
    marginBottom: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIcon: {
    marginRight: 12,
  },
  deviceTextCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 2,
  },
  currentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timeText: {
    marginTop: 2,
  },
  revokeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  footerWrap: {
    marginTop: 16,
  },
});

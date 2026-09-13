import React, { memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Card, Button } from '../../shared/components';
import { usePrivacySecurityStore } from '../../store/usePrivacySecurityStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface SecurityDashboardScreenProps {
  onBack?: () => void;
}

export const SecurityDashboardScreenComponent: React.FC<SecurityDashboardScreenProps> = ({
  onBack,
}) => {
  const { colors, theme } = useTheme();
  const security = usePrivacySecurityStore((state) => state.security);
  const terminateDevice = usePrivacySecurityStore((state) => state.terminateDevice);
  const terminateAllOther = usePrivacySecurityStore((state) => state.terminateAllOtherDevices);
  const { showToast } = useToast();

  const isRTL = I18nManager.isRTL;

  const handleTerminateAll = () => {
    terminateAllOther();
    showToast({
      message: 'Logged out of all other active sessions! 🔒',
      type: 'success',
    });
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return '📱';
      case 'desktop':
        return '💻';
      case 'tablet':
        return '📟';
      default:
        return '🖥️';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
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
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Typography variant="h3" color={colors.text}>
              {isRTL ? '➡️' : '⬅️'}
            </Typography>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Typography variant="h2" color={colors.text} bold>
            Security & Sessions
          </Typography>
          <Typography variant="caption" color={colors.textSecondary}>
            Device management, login history, and security logs
          </Typography>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Active Devices & Sessions */}
        <View style={styles.sectionHeaderRow}>
          <Typography variant="caption" color={colors.textSecondary} bold>
            WHERE YOU'RE LOGGED IN ({security.activeDevices.length} DEVICES)
          </Typography>
          {security.activeDevices.length > 1 && (
            <Button
              label="Log Out All Others 🔒"
              variant="ghost"
              size="sm"
              onPress={handleTerminateAll}
            />
          )}
        </View>

        <View style={styles.deviceList}>
          {security.activeDevices.map((dev) => (
            <Card
              key={dev.id}
              variant="flat"
              style={[
                styles.deviceCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: dev.isCurrent ? colors.primary : colors.borderSubtle,
                  borderWidth: dev.isCurrent ? 1.5 : 1,
                },
              ]}
            >
              <Typography variant="h2">{getDeviceIcon(dev.deviceType)}</Typography>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color={colors.text} bold>
                    {dev.name}
                  </Typography>
                  {dev.isCurrent && (
                    <View style={[styles.currentTag, { backgroundColor: colors.primaryLight }]}>
                      <Typography variant="caption" color={colors.primary} bold style={{ fontSize: 9 }}>
                        THIS DEVICE
                      </Typography>
                    </View>
                  )}
                </View>
                <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                  {dev.location} • {dev.ip}
                </Typography>
                <Typography variant="caption" color={dev.isCurrent ? colors.success : colors.textMuted} style={{ marginTop: 2 }}>
                  {dev.lastActive}
                </Typography>
              </View>

              {!dev.isCurrent && (
                <Button
                  label="Revoke"
                  variant="ghost"
                  size="sm"
                  onPress={() => {
                    terminateDevice(dev.id);
                    showToast({ message: `Session ${dev.name} terminated`, type: 'info' });
                  }}
                />
              )}
            </Card>
          ))}
        </View>

        {/* Section 2: Login History */}
        <Typography variant="caption" color={colors.textSecondary} bold style={styles.sectionHeader}>
          LOGIN HISTORY & AUTH ATTEMPTS
        </Typography>

        <Card variant="flat" style={[styles.historyBox, { backgroundColor: colors.surface }]}>
          {security.loginHistory.map((log) => (
            <View key={log.id} style={[styles.historyRow, { borderBottomColor: colors.borderSubtle }]}>
              <View style={{ flex: 1 }}>
                <Typography variant="subtitle2" color={colors.text} bold>
                  {log.device}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                  {log.location} • IP: {log.ip}
                </Typography>
                <Typography variant="caption" color={colors.textMuted} style={{ marginTop: 2 }}>
                  {log.timestamp}
                </Typography>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: log.status === 'success' ? '#34C75920' : '#FF3B3020',
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color={log.status === 'success' ? '#34C759' : '#FF3B30'}
                  bold
                  style={{ fontSize: 10 }}
                >
                  {log.status === 'success' ? '✓ SUCCESS' : '✕ FAILED'}
                </Typography>
              </View>
            </View>
          ))}
        </Card>

        {/* Section 3: Activity & Audit Trail */}
        <Typography variant="caption" color={colors.textSecondary} bold style={styles.sectionHeader}>
          SECURITY ACTIVITY AUDIT LOG
        </Typography>

        <Card variant="flat" style={[styles.historyBox, { backgroundColor: colors.surface }]}>
          {security.auditLogs.map((audit) => (
            <View key={audit.id} style={[styles.auditRow, { borderBottomColor: colors.borderSubtle }]}>
              <Typography variant="body1">🛡️</Typography>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Typography variant="subtitle2" color={colors.text} bold>
                  {audit.action}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                  {audit.details}
                </Typography>
                <Typography variant="caption" color={colors.textMuted} style={{ marginTop: 2 }}>
                  {audit.timestamp}
                </Typography>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

export const SecurityDashboardScreen = memo(SecurityDashboardScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  sectionHeader: {
    marginTop: 12,
    letterSpacing: 0.8,
  },
  deviceList: {
    gap: 8,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  currentTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  historyBox: {
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});

import React, { memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Button } from '../../shared/components';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface NotificationSettingsScreenProps {
  onBack?: () => void;
}

const NotificationSettingsScreenComponent: React.FC<NotificationSettingsScreenProps> = ({
  onBack,
}) => {
  const { colors, theme } = useTheme();
  const settings = useNotificationStore((state) => state.settings);
  const updateSettings = useNotificationStore((state) => state.updateSettings);
  const { showToast } = useToast();

  const isRTL = I18nManager.isRTL;

  const renderSwitchRow = (
    label: string,
    description: string,
    value: boolean,
    onValueChange: (val: boolean) => void,
    icon?: string
  ) => (
    <View
      style={[
        styles.switchRow,
        {
          borderBottomColor: colors.borderSubtle,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}
    >
      <View style={styles.switchTextCol}>
        <View style={styles.labelRow}>
          {Boolean(icon) && (
            <Typography variant="body1" style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }}>
              {icon}
            </Typography>
          )}
          <Typography variant="subtitle2" color={colors.text} bold>
            {label}
          </Typography>
        </View>
        <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
          {description}
        </Typography>
      </View>

      <Switch
        value={value}
        onValueChange={(val) => {
          onValueChange(val);
          showToast({ message: 'Settings saved', type: 'info' });
        }}
        trackColor={{ false: colors.borderSubtle, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
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
        <Typography variant="h2" color={colors.text} bold style={{ flex: 1 }}>
          Notification Preferences
        </Typography>
      </View>

      <View style={styles.section}>
        {/* 1. Push Notifications Section */}
        <Typography variant="subtitle1" color={colors.primary} bold style={styles.sectionHeader}>
          📲 Push Notifications
        </Typography>
        <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}>
          {renderSwitchRow(
            'Push Notifications Master',
            'Receive instant alerts on your device',
            settings.pushEnabled,
            (val) => updateSettings({ pushEnabled: val })
          )}
          {renderSwitchRow(
            'Likes & Reactions',
            'When someone likes or reacts to your posts',
            settings.pushLikesAndReactions,
            (val) => updateSettings({ pushLikesAndReactions: val }),
            '❤️'
          )}
          {renderSwitchRow(
            'Comments & Replies',
            'When someone comments on your thread',
            settings.pushCommentsAndReplies,
            (val) => updateSettings({ pushCommentsAndReplies: val }),
            '💬'
          )}
          {renderSwitchRow(
            'Mentions & Tags',
            'When you are @mentioned in a post or story',
            settings.pushMentionsAndTags,
            (val) => updateSettings({ pushMentionsAndTags: val }),
            '🏷️'
          )}
          {renderSwitchRow(
            'Direct Messages & Groups',
            'Incoming chat messages and mentions',
            settings.pushDirectMessages,
            (val) => updateSettings({ pushDirectMessages: val }),
            '✉️'
          )}
          {renderSwitchRow(
            'Incoming Call Alerts',
            'Voice and HD video call ring alerts',
            settings.pushCallAlerts,
            (val) => updateSettings({ pushCallAlerts: val }),
            '📞'
          )}
        </View>

        {/* 2. In-App Notifications Section */}
        <Typography variant="subtitle1" color={colors.primary} bold style={styles.sectionHeader}>
          🔔 In-App Alerts
        </Typography>
        <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}>
          {renderSwitchRow(
            'In-App Floating Banners',
            'Show top alert banner while using the app',
            settings.inAppEnabled,
            (val) => updateSettings({ inAppEnabled: val })
          )}
          {renderSwitchRow(
            'Notification Sounds',
            'Play audio sound on new incoming alert',
            settings.inAppSound,
            (val) => updateSettings({ inAppSound: val }),
            '🔊'
          )}
          {renderSwitchRow(
            'Vibration Feedback',
            'Vibrate device on incoming notifications',
            settings.inAppVibration,
            (val) => updateSettings({ inAppVibration: val }),
            '📳'
          )}
        </View>

        {/* 3. Email Notifications Section */}
        <Typography variant="subtitle1" color={colors.primary} bold style={styles.sectionHeader}>
          📧 Email Notifications
        </Typography>
        <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}>
          {renderSwitchRow(
            'Email Notifications Master',
            'Receive updates to alex.rivera@meta.enterprise',
            settings.emailEnabled,
            (val) => updateSettings({ emailEnabled: val })
          )}
          {renderSwitchRow(
            'Weekly Activity Digest',
            'Summary of trending feeds and network highlights',
            settings.emailWeeklyDigest,
            (val) => updateSettings({ emailWeeklyDigest: val }),
            '📰'
          )}
          {renderSwitchRow(
            'Security & Login Alerts',
            'Critical account security notices and 2FA logins',
            settings.emailSecurityAlerts,
            (val) => updateSettings({ emailSecurityAlerts: val }),
            '🛡️'
          )}
        </View>

        {/* 4. SMS Notifications Section */}
        <Typography variant="subtitle1" color={colors.primary} bold style={styles.sectionHeader}>
          💬 SMS Notifications
        </Typography>
        <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}>
          {renderSwitchRow(
            'SMS 2FA Verification Codes',
            'Receive one-time passwords for authentication',
            settings.smsTwoFactorAlerts,
            (val) => updateSettings({ smsTwoFactorAlerts: val }),
            '🔐'
          )}
          {renderSwitchRow(
            'Critical Security SMS',
            'Urgent account takeover attempt warnings',
            settings.smsSecurityAlerts,
            (val) => updateSettings({ smsSecurityAlerts: val }),
            '🚨'
          )}
        </View>

        {/* 5. Quiet Hours / Do Not Disturb */}
        <Typography variant="subtitle1" color={colors.primary} bold style={styles.sectionHeader}>
          🌙 Quiet Hours (Do Not Disturb)
        </Typography>
        <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}>
          {renderSwitchRow(
            'Enable Quiet Hours',
            `Mute all notifications between ${settings.quietHoursStart} and ${settings.quietHoursEnd}`,
            settings.dndEnabled,
            (val) => updateSettings({ dndEnabled: val }),
            '🌙'
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export const NotificationSettingsScreen = memo(NotificationSettingsScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  section: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 4,
  },
  card: {
    overflow: 'hidden',
  },
  switchRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

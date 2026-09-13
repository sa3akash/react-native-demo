import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Card, Button, SegmentedControl } from '../../shared/components';
import {
  usePrivacySecurityStore,
  PostAudience,
  ProfileVisibility,
  MessagePermission,
} from '../../store/usePrivacySecurityStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface PrivacySettingsScreenProps {
  onBack?: () => void;
}

const AUDIENCE_OPTIONS: Array<{ id: PostAudience; label: string; desc: string; icon: string }> = [
  { id: 'public', label: 'Public 🌐', desc: 'Anyone on or off SocialSphere can see your posts', icon: '🌐' },
  { id: 'friends', label: 'Friends 👥', desc: 'Only approved friends in your network can see', icon: '👥' },
  { id: 'private', label: 'Only Me 🔒', desc: 'Only you can view these posts', icon: '🔒' },
  { id: 'custom', label: 'Custom Audience 🎯', desc: 'Specify custom whitelist or excluded friend lists', icon: '🎯' },
];

const PROFILE_VIS_OPTIONS = [
  { id: 'everyone', label: 'Everyone' },
  { id: 'friends', label: 'Friends Only' },
  { id: 'private', label: 'Hidden / Private' },
];

const MESSAGE_PERM_OPTIONS = [
  { id: 'everyone', label: 'Everyone' },
  { id: 'friends', label: 'Friends' },
  { id: 'nobody', label: 'Nobody' },
];

export const PrivacySettingsScreenComponent: React.FC<PrivacySettingsScreenProps> = ({
  onBack,
}) => {
  const { colors, theme } = useTheme();
  const privacy = usePrivacySecurityStore((state) => state.privacy);
  const setPostAudience = usePrivacySecurityStore((state) => state.setPostAudience);
  const updatePrivacy = usePrivacySecurityStore((state) => state.updatePrivacySettings);
  const { showToast } = useToast();

  const isRTL = I18nManager.isRTL;

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
            Privacy Settings
          </Typography>
          <Typography variant="caption" color={colors.textSecondary}>
            Control your audience, profile, and direct interactions
          </Typography>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Default Post Audience */}
        <Typography variant="caption" color={colors.textSecondary} bold style={styles.sectionTitle}>
          DEFAULT POST AUDIENCE
        </Typography>

        <View style={styles.audienceList}>
          {AUDIENCE_OPTIONS.map((opt) => {
            const isSelected = privacy.defaultPostAudience === opt.id;

            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.8}
                onPress={() => {
                  setPostAudience(opt.id);
                  showToast({ message: `Default audience set to ${opt.label}`, type: 'success' });
                }}
                style={[
                  styles.audienceCard,
                  {
                    backgroundColor: isSelected ? colors.surfaceElevated : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderRadius: theme.radius.md,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                <Typography variant="h3">{opt.icon}</Typography>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Typography variant="subtitle2" color={colors.text} bold>
                    {opt.label}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                    {opt.desc}
                  </Typography>
                </View>
                {isSelected && (
                  <Typography variant="body1" color={colors.primary} bold>
                    ✓
                  </Typography>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section 2: Profile & Discovery */}
        <Typography variant="caption" color={colors.textSecondary} bold style={styles.sectionTitle}>
          PROFILE & SEARCH VISIBILITY
        </Typography>
        <Card variant="flat" style={[styles.cardBox, { backgroundColor: colors.surface }]}>
          <Typography variant="subtitle2" color={colors.text} bold>
            Who Can See Your Profile & Followers
          </Typography>
          <View style={{ marginTop: 8 }}>
            <SegmentedControl
              segments={PROFILE_VIS_OPTIONS}
              activeId={privacy.profileVisibility}
              onSelect={(id) => {
                updatePrivacy({ profileVisibility: id as ProfileVisibility });
                showToast({ message: 'Profile visibility updated', type: 'info' });
              }}
              size="sm"
            />
          </View>

          <View
            style={[
              styles.switchRow,
              {
                borderTopColor: colors.borderSubtle,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                Search Engine Indexing 🔍
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Allow Google and public search engines to link to your public profile
              </Typography>
            </View>
            <Switch
              value={privacy.allowSearchIndexing}
              onValueChange={(val) => {
                updatePrivacy({ allowSearchIndexing: val });
                showToast({ message: 'Search indexing updated', type: 'info' });
              }}
              trackColor={{ false: colors.borderSubtle, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* Section 3: Messages & Real-Time Indicators */}
        <Typography variant="caption" color={colors.textSecondary} bold style={styles.sectionTitle}>
          INTERACTIONS & MESSAGING
        </Typography>
        <Card variant="flat" style={[styles.cardBox, { backgroundColor: colors.surface }]}>
          <Typography variant="subtitle2" color={colors.text} bold>
            Who Can Send You Direct Messages
          </Typography>
          <View style={{ marginTop: 8 }}>
            <SegmentedControl
              segments={MESSAGE_PERM_OPTIONS}
              activeId={privacy.whoCanMessageMe}
              onSelect={(id) => {
                updatePrivacy({ whoCanMessageMe: id as MessagePermission });
                showToast({ message: 'Message permissions updated', type: 'info' });
              }}
              size="sm"
            />
          </View>

          <View
            style={[
              styles.switchRow,
              {
                borderTopColor: colors.borderSubtle,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                Read Receipts (Blue Checkmarks)
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Let message senders know when you have read their messages
              </Typography>
            </View>
            <Switch
              value={privacy.readReceiptsEnabled}
              onValueChange={(val) => updatePrivacy({ readReceiptsEnabled: val })}
              trackColor={{ false: colors.borderSubtle, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[
              styles.switchRow,
              {
                borderTopColor: colors.borderSubtle,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                Online Presence Status 🟢
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Show when you are actively online and recently active
              </Typography>
            </View>
            <Switch
              value={privacy.onlineStatusVisible}
              onValueChange={(val) => updatePrivacy({ onlineStatusVisible: val })}
              trackColor={{ false: colors.borderSubtle, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

export const PrivacySettingsScreen = memo(PrivacySettingsScreenComponent);

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
    gap: 12,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 2,
    letterSpacing: 0.8,
  },
  audienceList: {
    gap: 8,
  },
  audienceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  cardBox: {
    padding: 14,
    gap: 12,
  },
  switchRow: {
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

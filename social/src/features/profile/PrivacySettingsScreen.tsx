import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Card, Checkbox, SegmentedControl, Button } from '../../shared/components';
import { useAuthStore, PrivacySettings } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface PrivacySettingsScreenProps {
  onBack: () => void;
}

const PrivacySettingsScreenComponent: React.FC<PrivacySettingsScreenProps> = ({ onBack }) => {
  const { colors, theme } = useTheme();
  const { user, updatePrivacySettings } = useAuthStore();
  const { showToast } = useToast();

  const current = user?.privacySettings || {
    profileVisibility: 'public',
    showActivityStatus: true,
    showReadReceipts: true,
    allowTagging: 'everyone',
    allowDirectMessages: 'everyone',
    searchEngineIndexing: true,
  };

  const [visibility, setVisibility] = useState<'public' | 'private' | 'followers'>(current.profileVisibility);
  const [showActivity, setShowActivity] = useState(current.showActivityStatus);
  const [showReceipts, setShowReceipts] = useState(current.showReadReceipts);
  const [tagging, setTagging] = useState<'everyone' | 'followers' | 'none'>(current.allowTagging);
  const [dms, setDms] = useState<'everyone' | 'followers' | 'none'>(current.allowDirectMessages);
  const [searchIndexing, setSearchIndexing] = useState(current.searchEngineIndexing);

  const handleSave = () => {
    updatePrivacySettings({
      profileVisibility: visibility,
      showActivityStatus: showActivity,
      showReadReceipts: showReceipts,
      allowTagging: tagging,
      allowDirectMessages: dms,
      searchEngineIndexing: searchIndexing,
    });
    showToast({ message: 'Privacy preferences saved! 🛡️', type: 'success' });
    onBack();
  };

  const visibilitySegments = [
    { id: 'public', label: '🌍 Public' },
    { id: 'followers', label: '👥 Followers' },
    { id: 'private', label: '🔒 Private' },
  ];

  const permissionSegments = [
    { id: 'everyone', label: 'Everyone' },
    { id: 'followers', label: 'Followers' },
    { id: 'none', label: 'No One' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle, backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} accessible={true} accessibilityRole="button">
          <Typography variant="h3" color={colors.text}>
            ←
          </Typography>
        </TouchableOpacity>
        <Typography variant="h4" color={colors.text} bold>
          Privacy Settings
        </Typography>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn} accessible={true} accessibilityRole="button">
          <Typography variant="subtitle2" color={colors.primary} bold>
            Save
          </Typography>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Visibility */}
        <Card variant="flat" padding={16} style={[styles.card, { backgroundColor: colors.surface }]}>
          <Typography variant="subtitle1" color={colors.text} bold>
            Account Visibility
          </Typography>
          <Typography variant="caption" color={colors.textSecondary} style={styles.subtext}>
            Choose who can see your posts, stories, followers, and work experience.
          </Typography>
          <SegmentedControl
            segments={visibilitySegments}
            activeId={visibility}
            onSelect={(id) => setVisibility(id as any)}
          />
        </Card>

        {/* Messaging & Interaction */}
        <Card variant="flat" padding={16} style={[styles.card, { backgroundColor: colors.surface }]}>
          <Typography variant="subtitle1" color={colors.text} bold>
            Direct Messages & Calls
          </Typography>
          <Typography variant="caption" color={colors.textSecondary} style={styles.subtext}>
            Control who can send you direct message requests and audio/video calls.
          </Typography>
          <SegmentedControl
            segments={permissionSegments}
            activeId={dms}
            onSelect={(id) => setDms(id as any)}
          />

          <View style={styles.divider} />

          <Typography variant="subtitle1" color={colors.text} bold>
            Tagging & Mentions
          </Typography>
          <Typography variant="caption" color={colors.textSecondary} style={styles.subtext}>
            Choose who can tag you in posts, reels, and comments.
          </Typography>
          <SegmentedControl
            segments={permissionSegments}
            activeId={tagging}
            onSelect={(id) => setTagging(id as any)}
          />
        </Card>

        {/* Presence & Receipts */}
        <Card variant="flat" padding={16} style={[styles.card, { backgroundColor: colors.surface }]}>
          <Typography variant="subtitle1" color={colors.text} bold style={styles.sectionTitle}>
            Activity & Status
          </Typography>

          <Checkbox
            checked={showActivity}
            onChange={setShowActivity}
            label="Show Online Status"
            sublabel="Allow connections to see when you are currently active on SocialSphere."
          />

          <View style={styles.spacer} />

          <Checkbox
            checked={showReceipts}
            onChange={setShowReceipts}
            label="Show Read Receipts"
            sublabel="Let chat participants know when you have read their messages."
          />

          <View style={styles.spacer} />

          <Checkbox
            checked={searchIndexing}
            onChange={setSearchIndexing}
            label="Public Search Engine Indexing"
            sublabel="Allow Google and search engines to index your public profile."
          />
        </Card>

        <View style={styles.btnWrap}>
          <Button label="Save Changes" variant="primary" size="lg" onPress={handleSave} fullWidth />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const PrivacySettingsScreen = memo(PrivacySettingsScreenComponent);

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
  saveBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    marginBottom: 4,
  },
  subtext: {
    marginTop: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: 14,
  },
  spacer: {
    height: 10,
  },
  btnWrap: {
    marginTop: 10,
  },
});

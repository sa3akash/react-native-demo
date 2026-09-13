import React, { memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  AccessibilityInfo,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Card, Button, SegmentedControl } from '../../shared/components';
import { usePrivacySecurityStore, FontSizeScale } from '../../store/usePrivacySecurityStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface AccessibilitySettingsScreenProps {
  onBack?: () => void;
}

const FONT_OPTIONS = [
  { id: 'normal', label: 'Default (100%)' },
  { id: 'large', label: 'Large (115%)' },
  { id: 'extra_large', label: 'X-Large (130%)' },
];

export const AccessibilitySettingsScreenComponent: React.FC<AccessibilitySettingsScreenProps> = ({
  onBack,
}) => {
  const { colors } = useTheme();
  const accessibility = usePrivacySecurityStore((state) => state.accessibility);
  const setFontSizeScale = usePrivacySecurityStore((state) => state.setFontSizeScale);
  const toggleHighContrast = usePrivacySecurityStore((state) => state.toggleHighContrast);
  const toggleReduceMotion = usePrivacySecurityStore((state) => state.toggleReduceMotion);
  const toggleScreenReader = usePrivacySecurityStore((state) => state.toggleScreenReaderAnnouncements);
  const { showToast } = useToast();

  const isRTL = I18nManager.isRTL;

  const handleTestScreenReader = () => {
    AccessibilityInfo.announceForAccessibility('VoiceOver and TalkBack test announcement. SocialSphere accessibility active.');
    showToast({
      message: 'Dispatched VoiceOver / TalkBack announcement 📢',
      type: 'success',
    });
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
            Accessibility & Display
          </Typography>
          <Typography variant="caption" color={colors.textSecondary}>
            VoiceOver, TalkBack, dynamic text, and high contrast
          </Typography>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Dynamic Font Sizing */}
        <Typography variant="caption" color={colors.textSecondary} bold style={styles.sectionHeader}>
          DYNAMIC FONT SCALING
        </Typography>

        <Card variant="flat" style={[styles.cardBox, { backgroundColor: colors.surface }]}>
          <Typography variant="subtitle2" color={colors.text} bold>
            App-Wide Text Scaling
          </Typography>
          <View style={{ marginVertical: 8 }}>
            <SegmentedControl
              segments={FONT_OPTIONS}
              activeId={accessibility.fontSizeScale}
              onSelect={(id) => {
                setFontSizeScale(id as FontSizeScale);
                showToast({ message: `Font scale set to ${id}`, type: 'info' });
              }}
              size="sm"
            />
          </View>

          {/* Live Preview Box */}
          <View style={[styles.previewBox, { backgroundColor: colors.surfaceElevated }]}>
            <Typography
              variant="body1"
              color={colors.text}
              style={{
                fontSize:
                  accessibility.fontSizeScale === 'extra_large'
                    ? 20
                    : accessibility.fontSizeScale === 'large'
                    ? 18
                    : 15,
                lineHeight:
                  accessibility.fontSizeScale === 'extra_large'
                    ? 28
                    : accessibility.fontSizeScale === 'large'
                    ? 24
                    : 20,
              }}
            >
              The quick brown fox jumps over the lazy dog. Real-time dynamic typography preview.
            </Typography>
          </View>
        </Card>

        {/* Section 2: Visual & Contrast Options */}
        <Typography variant="caption" color={colors.textSecondary} bold style={styles.sectionHeader}>
          VISUAL & CONTRAST
        </Typography>

        <Card variant="flat" style={[styles.cardBox, { backgroundColor: colors.surface }]}>
          <View
            style={[
              styles.switchRow,
              {
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                High Contrast Mode 👁️
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Enhance text and border contrast to meet WCAG AAA accessibility ratios
              </Typography>
            </View>
            <Switch
              value={accessibility.highContrastMode}
              onValueChange={toggleHighContrast}
              trackColor={{ false: colors.borderSubtle, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[
              styles.switchRow,
              {
                borderTopColor: colors.borderSubtle,
                borderTopWidth: StyleSheet.hairlineWidth,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                Reduce Motion & Animations 🍃
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Disable spring animations and intense video transitions for motion sensitivity
              </Typography>
            </View>
            <Switch
              value={accessibility.reduceMotion}
              onValueChange={toggleReduceMotion}
              trackColor={{ false: colors.borderSubtle, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* Section 3: Screen Reader Support (VoiceOver / TalkBack) */}
        <Typography variant="caption" color={colors.textSecondary} bold style={styles.sectionHeader}>
          SCREEN READERS (VOICEOVER / TALKBACK)
        </Typography>

        <Card variant="flat" style={[styles.cardBox, { backgroundColor: colors.surface }]}>
          <View
            style={[
              styles.switchRow,
              {
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                Haptic & Audio Announcements 🔊
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Provide vocal announcements on dynamic state changes and notifications
              </Typography>
            </View>
            <Switch
              value={accessibility.screenReaderAnnouncements}
              onValueChange={toggleScreenReader}
              trackColor={{ false: colors.borderSubtle, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <Button
            label="Test VoiceOver / TalkBack Announcement 📢"
            variant="ghost"
            size="md"
            onPress={handleTestScreenReader}
            fullWidth
            style={{ marginTop: 8 }}
          />
        </Card>
      </ScrollView>
    </View>
  );
};

export const AccessibilitySettingsScreen = memo(AccessibilitySettingsScreenComponent);

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
  sectionHeader: {
    marginTop: 8,
    letterSpacing: 0.8,
  },
  cardBox: {
    padding: 14,
    borderRadius: 8,
    gap: 10,
  },
  previewBox: {
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  switchRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
});

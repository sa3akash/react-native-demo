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
import { ThemeMode } from '../../theme/types';
import { Typography, Card, Button } from '../../shared/components';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { biometricsService } from '../../core/security/BiometricsService';
import { PrivacySettingsScreen } from './PrivacySettingsScreen';
import { SecurityDashboardScreen } from './SecurityDashboardScreen';
import { AccessibilitySettingsScreen } from './AccessibilitySettingsScreen';
import { LanguageSelectorModal } from './LanguageSelectorModal';
import { ModerationDashboardScreen } from '../moderation/ModerationDashboardScreen';

export const SettingsScreenComponent: React.FC<{
  onBack?: () => void;
}> = ({ onBack }) => {
  const { colors, mode, setMode } = useTheme();
  const { user, logout } = useAuthStore();
  const { showToast } = useToast();

  const [currentSubscreen, setCurrentSubscreen] = useState<
    'privacy' | 'security' | 'accessibility' | 'moderation' | null
  >(null);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(
    biometricsService.isBiometricLockEnabled()
  );

  const isRTL = I18nManager.isRTL;

  if (currentSubscreen === 'privacy') {
    return <PrivacySettingsScreen onBack={() => setCurrentSubscreen(null)} />;
  }
  if (currentSubscreen === 'security') {
    return <SecurityDashboardScreen onBack={() => setCurrentSubscreen(null)} />;
  }
  if (currentSubscreen === 'accessibility') {
    return <AccessibilitySettingsScreen onBack={() => setCurrentSubscreen(null)} />;
  }
  if (currentSubscreen === 'moderation') {
    return <ModerationDashboardScreen onBack={() => setCurrentSubscreen(null)} />;
  }

  const handleBiometricToggle = (value: boolean) => {
    biometricsService.setBiometricLockEnabled(value);
    setBiometricEnabled(value);
    showToast({
      message: value ? 'Biometric lock enabled 🔒' : 'Biometric lock disabled',
      type: 'info',
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
          <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
            <Typography variant="h3" color={colors.text}>
              {isRTL ? '➡️' : '⬅️'}
            </Typography>
          </TouchableOpacity>
        )}
        <Typography variant="h2" color={colors.text} bold>
          Settings & Preferences
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Navigation Categories */}
        <Typography variant="caption" color={colors.textSecondary} bold style={styles.sectionHeader}>
          ACCOUNT & SECURITY
        </Typography>

        <Card variant="flat" style={[styles.cardBox, { backgroundColor: colors.surface }]}>
          {/* Privacy */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setCurrentSubscreen('privacy')}
            style={[styles.navRow, { borderBottomColor: colors.borderSubtle }]}
          >
            <Typography variant="h3">🔒</Typography>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                Privacy & Audience
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Post visibility, search indexing, messaging rules
              </Typography>
            </View>
            <Typography variant="caption" color={colors.textSecondary}>
              {isRTL ? '‹' : '›'}
            </Typography>
          </TouchableOpacity>

          {/* Security & Sessions */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setCurrentSubscreen('security')}
            style={[styles.navRow, { borderBottomColor: colors.borderSubtle }]}
          >
            <Typography variant="h3">🛡️</Typography>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                Security & Active Devices
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Device sessions, login history, security audit trail
              </Typography>
            </View>
            <Typography variant="caption" color={colors.textSecondary}>
              {isRTL ? '‹' : '›'}
            </Typography>
          </TouchableOpacity>

          {/* Accessibility */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setCurrentSubscreen('accessibility')}
            style={[styles.navRow, { borderBottomColor: colors.borderSubtle }]}
          >
            <Typography variant="h3">♿</Typography>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                Accessibility & Display
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                VoiceOver, TalkBack, dynamic font scaling, contrast
              </Typography>
            </View>
            <Typography variant="caption" color={colors.textSecondary}>
              {isRTL ? '‹' : '›'}
            </Typography>
          </TouchableOpacity>

          {/* Trust & Safety Moderation */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setCurrentSubscreen('moderation')}
            style={[styles.navRow, { borderBottomColor: colors.borderSubtle }]}
          >
            <Typography variant="h3">⚖️</Typography>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                Trust & Safety Center
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                AI automated moderation, reports queue, content warnings
              </Typography>
            </View>
            <Typography variant="caption" color={colors.textSecondary}>
              {isRTL ? '‹' : '›'}
            </Typography>
          </TouchableOpacity>

          {/* Language */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsLangModalOpen(true)}
            style={styles.navRow}
          >
            <Typography variant="h3">🌐</Typography>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Typography variant="subtitle2" color={colors.text} bold>
                Language & Region
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Multi-language translations & RTL localization
              </Typography>
            </View>
            <Typography variant="caption" color={colors.textSecondary}>
              {isRTL ? '‹' : '›'}
            </Typography>
          </TouchableOpacity>
        </Card>

        {/* Appearance / Theme */}
        <Typography variant="caption" color={colors.textSecondary} bold style={styles.sectionHeader}>
          APPEARANCE & THEME
        </Typography>
        <Card variant="flat" style={[styles.cardBox, { backgroundColor: colors.surface }]}>
          {(['system', 'light', 'dark', 'amoled'] as ThemeMode[]).map((t) => {
            const isSelected = mode === t;
            return (
              <TouchableOpacity
                key={t}
                activeOpacity={0.7}
                onPress={() => {
                  setMode(t);
                  showToast({ message: `Theme set to ${t}`, type: 'info' });
                }}
                style={[
                  styles.themeRow,
                  {
                    borderBottomColor: colors.borderSubtle,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                  },
                ]}
              >
                <Typography variant="body1" color={colors.text} bold style={{ textTransform: 'capitalize' }}>
                  {t}
                </Typography>
                {isSelected && (
                  <Typography variant="body1" color={colors.primary} bold>
                    ✓
                  </Typography>
                )}
              </TouchableOpacity>
            );
          })}
        </Card>

        {/* Biometrics */}
        <Typography variant="caption" color={colors.textSecondary} bold style={styles.sectionHeader}>
          DEVICE SECURITY
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
                Face ID / Fingerprint Lock 🔐
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Require biometric authentication on launch
              </Typography>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: colors.borderSubtle, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* Log Out */}
        <View style={{ marginTop: 14 }}>
          <Button
            label="Log Out of SocialSphere"
            variant="ghost"
            size="lg"
            onPress={() => {
              logout();
              showToast({ message: 'Logged out successfully', type: 'info' });
            }}
            fullWidth
          />
        </View>
      </ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        visible={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
    </View>
  );
};

export const SettingsScreen = memo(SettingsScreenComponent);

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
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  themeRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  switchRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
});

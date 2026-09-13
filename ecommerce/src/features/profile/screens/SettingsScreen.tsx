import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenWrapper, Header, useTheme } from '../../../design-system';

export interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { colors, spacing, typography, mode, setThemeMode, isDark } =
    useTheme();

  return (
    <ScreenWrapper scrollable>
      <Header title="Settings & Appearance" showBack onBackPress={onBack} />

      <View style={{ padding: spacing.md }}>
        <Text
          style={[
            typography.h2,
            { color: colors.text, marginBottom: spacing.md },
          ]}
        >
          App Appearance
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.borderSubtle },
          ]}
        >
          <Text
            style={[
              typography.body,
              styles.themeHeaderTitle,
              { color: colors.text },
            ]}
          >
            Theme Mode (Current: {isDark ? 'Dark' : 'Light'})
          </Text>

          <View style={styles.optionRow}>
            <TouchableOpacity
              onPress={() => setThemeMode('light')}
              style={[
                styles.themeBtn,
                {
                  borderColor:
                    mode === 'light' ? colors.primary : colors.border,
                  backgroundColor:
                    mode === 'light' ? colors.warningLight : colors.surface,
                },
              ]}
            >
              <Text
                style={[
                  typography.bodySmall,
                  styles.boldBtnText,
                  { color: mode === 'light' ? colors.warning : colors.text },
                ]}
              >
                ☀️ Light Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setThemeMode('dark')}
              style={[
                styles.themeBtn,
                {
                  borderColor: mode === 'dark' ? colors.primary : colors.border,
                  backgroundColor:
                    mode === 'dark' ? colors.warningLight : colors.surface,
                },
              ]}
            >
              <Text
                style={[
                  typography.bodySmall,
                  styles.boldBtnText,
                  { color: mode === 'dark' ? colors.warning : colors.text },
                ]}
              >
                🌙 Dark Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setThemeMode('system')}
              style={[
                styles.themeBtn,
                {
                  borderColor:
                    mode === 'system' ? colors.primary : colors.border,
                  backgroundColor:
                    mode === 'system' ? colors.warningLight : colors.surface,
                },
              ]}
            >
              <Text
                style={[
                  typography.bodySmall,
                  styles.boldBtnText,
                  { color: mode === 'system' ? colors.warning : colors.text },
                ]}
              >
                📱 System Default
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={[
            typography.h2,
            {
              color: colors.text,
              marginTop: spacing.xl,
              marginBottom: spacing.md,
            },
          ]}
        >
          App Info & Legal
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.borderSubtle },
          ]}
        >
          <Text style={[typography.body, { color: colors.text }]}>
            Amazon E-Commerce Mobile App
          </Text>
          <Text
            style={[
              typography.caption,
              styles.infoSubtext,
              { color: colors.textMuted },
            ]}
          >
            Version 1.0.0 (Production Release Build)
          </Text>
          <Text
            style={[
              typography.caption,
              styles.infoSubtext,
              { color: colors.textMuted },
            ]}
          >
            Hermes Engine Enabled | React Native CLI
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeHeaderTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  optionRow: {
    gap: 8,
  },
  themeBtn: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  boldBtnText: {
    fontWeight: '700',
  },
  infoSubtext: {
    marginTop: 2,
  },
});

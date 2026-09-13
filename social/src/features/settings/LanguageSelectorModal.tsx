import React, { memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, BottomSheet } from '../../shared/components';
import { changeLanguage } from '../../locales/i18n';
import { useToast } from '../../shared/components/molecules/Toast';
import i18n from '../../locales/i18n';

export interface LanguageSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸', native: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'ar', name: 'Arabic (RTL)', flag: '🇸🇦', native: 'العربية' },
  { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語' },
];

const LanguageSelectorModalComponent: React.FC<LanguageSelectorModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, theme } = useTheme();
  const { showToast } = useToast();
  const currentLang = i18n.language || 'en';

  const handleSelect = async (code: string, name: string) => {
    await changeLanguage(code);
    showToast({
      message: `Language updated to ${name}! 🌐`,
      type: 'success',
    });
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Select Language & Region 🌐">
      <ScrollView contentContainerStyle={styles.content}>
        {LANGUAGES.map((lang) => {
          const isSelected = currentLang === lang.code;

          return (
            <TouchableOpacity
              key={lang.code}
              activeOpacity={0.8}
              onPress={() => handleSelect(lang.code, lang.native)}
              style={[
                styles.langRow,
                {
                  backgroundColor: isSelected ? colors.surfaceElevated : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.borderSubtle,
                  borderRadius: theme.radius.md,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              <Typography variant="h3">{lang.flag}</Typography>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Typography variant="subtitle2" color={colors.text} bold>
                  {lang.native}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  {lang.name}
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
      </ScrollView>
    </BottomSheet>
  );
};

export const LanguageSelectorModal = memo(LanguageSelectorModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 8,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
});

import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography } from '../../shared/components';
import { SocialProvider, useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface SocialLoginButtonsProps {
  onSuccess?: () => void;
  disabled?: boolean;
}

interface SocialConfig {
  provider: SocialProvider;
  name: string;
  icon: string;
  color: string;
  textColor: string;
}

const SOCIAL_PROVIDERS: SocialConfig[] = [
  { provider: 'google', name: 'Google', icon: '🌐', color: '#FFFFFF', textColor: '#1F1F1F' },
  { provider: 'apple', name: 'Apple', icon: '🍏', color: '#000000', textColor: '#FFFFFF' },
  { provider: 'facebook', name: 'Facebook', icon: '🔵', color: '#1877F2', textColor: '#FFFFFF' },
  { provider: 'github', name: 'GitHub', icon: '🐙', color: '#24292E', textColor: '#FFFFFF' },
  { provider: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2', textColor: '#FFFFFF' },
];

const SocialLoginButtonsComponent: React.FC<SocialLoginButtonsProps> = ({
  onSuccess,
  disabled = false,
}) => {
  const { colors, theme } = useTheme();
  const { loginWithSocial } = useAuthStore();
  const { showToast } = useToast();

  const handleSocialPress = async (provider: SocialProvider, name: string) => {
    try {
      showToast({ message: `Signing in with ${name}...`, type: 'info' });
      await loginWithSocial(provider);
      showToast({ message: `Successfully connected with ${name}! 🎉`, type: 'success' });
      onSuccess?.();
    } catch (err: any) {
      showToast({ message: err?.message || 'Social sign in failed.', type: 'danger' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={[styles.line, { backgroundColor: colors.borderSubtle }]} />
        <Typography variant="caption" color={colors.textMuted} style={styles.orText}>
          OR CONTINUE WITH
        </Typography>
        <View style={[styles.line, { backgroundColor: colors.borderSubtle }]} />
      </View>

      <View style={styles.buttonsGrid}>
        {SOCIAL_PROVIDERS.map((item) => {
          // On Android, Apple Sign-in is optional, but supported
          return (
            <TouchableOpacity
              key={item.provider}
              activeOpacity={0.8}
              disabled={disabled}
              onPress={() => handleSocialPress(item.provider, item.name)}
              style={[
                styles.socialBtn,
                {
                  backgroundColor: item.color,
                  borderColor: colors.borderSubtle,
                  borderRadius: theme.radius.md,
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Sign in with ${item.name}`}
            >
              <Typography variant="h4" style={styles.icon}>
                {item.icon}
              </Typography>
              <Typography
                variant="buttonSmall"
                color={item.textColor}
                bold
                style={styles.btnLabel}
              >
                {item.name}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const SocialLoginButtons = memo(SocialLoginButtonsComponent);

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  orText: {
    marginHorizontal: 12,
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 6,
    fontSize: 18,
  },
  btnLabel: {},
});

import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Button, Input, Card } from '../../shared/components';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { SocialLoginButtons } from './SocialLoginButtons';

export interface LoginScreenProps {
  onNavigateToRegister?: () => void;
  onNavigateToForgotPassword?: () => void;
  onNavigateTo2FA?: () => void;
  onLoginSuccess?: () => void;
}

const LoginScreenComponent: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onNavigateTo2FA,
  onLoginSuccess,
}) => {
  const { colors } = useTheme();
  const { login, unlockWithBiometrics } = useAuthStore();
  const { showToast } = useToast();

  const [email, setEmail] = useState('alex.rivera@metaverse.io');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast({ message: 'Please enter your email and password.', type: 'warning' });
      return;
    }
    setLoading(true);

    try {
      setTimeout(() => {
        login(
          {
            id: 'usr_meta_998',
            username: 'alex.rivera',
            name: 'Alex Rivera',
            email,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
            followersCount: 14200,
            followingCount: 680,
            postsCount: 184,
            isVerified: true,
            twoFactorEnabled: true,
          },
          'token_jwt_mock_123',
          'token_refresh_mock_123'
        );
        setLoading(false);
        showToast({ message: 'Welcome back, Alex! 👋', type: 'success' });
        onLoginSuccess?.();
      }, 600);
    } catch {
      setLoading(false);
      showToast({ message: 'Login failed. Please check credentials.', type: 'danger' });
    }
  };

  const handleBiometricLogin = async () => {
    setIsBiometricLoading(true);
    const success = await unlockWithBiometrics();
    setIsBiometricLoading(false);

    if (success) {
      showToast({ message: 'Biometric authentication verified! ⚡', type: 'success' });
      onLoginSuccess?.();
    } else {
      showToast({ message: 'Biometric verification failed or cancelled.', type: 'warning' });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h1" color={colors.primary} bold style={styles.brandTitle}>
            SocialSphere
          </Typography>
          <Typography variant="subtitle1" color={colors.textSecondary} align="center">
            Connect, share, and experience next-gen social media.
          </Typography>
        </View>

        <Card variant="elevated" padding={24} style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeaderRow}>
            <Typography variant="h4" color={colors.text} bold>
              Log In
            </Typography>
            <TouchableOpacity
              onPress={handleBiometricLogin}
              style={[styles.biometricPill, { backgroundColor: colors.primaryLight }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Biometric login"
            >
              <Typography variant="body2" color={colors.primary} bold>
                {isBiometricLoading ? 'Verifying...' : '⚡ Biometrics'}
              </Typography>
            </TouchableOpacity>
          </View>

          <Input
            label="Email or Username"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <View style={styles.actionLinksRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onNavigateToForgotPassword}
              accessible={true}
              accessibilityRole="button"
            >
              <Typography variant="caption" color={colors.primary} bold>
                Forgot Password?
              </Typography>
            </TouchableOpacity>

            {onNavigateTo2FA && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onNavigateTo2FA}
                accessible={true}
                accessibilityRole="button"
              >
                <Typography variant="caption" color={colors.textSecondary} bold>
                  🔐 2FA Code
                </Typography>
              </TouchableOpacity>
            )}
          </View>

          <Button
            label="Log In"
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleLogin}
            fullWidth
            style={styles.loginBtn}
          />

          {/* Social Logins (Google, Apple, Facebook, GitHub, LinkedIn) */}
          <SocialLoginButtons onSuccess={onLoginSuccess} />
        </Card>

        <View style={styles.footerRow}>
          <Typography variant="body2" color={colors.textSecondary}>
            Don't have an account?{' '}
          </Typography>
          <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToRegister}>
            <Typography variant="body2" color={colors.primary} bold>
              Sign Up
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const LoginScreen = memo(LoginScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandTitle: {
    fontSize: 36,
    letterSpacing: -1,
    marginBottom: 6,
  },
  card: {
    marginBottom: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  biometricPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  actionLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  loginBtn: {
    marginTop: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

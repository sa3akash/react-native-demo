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
import { Typography, Button, Input, Card, Checkbox } from '../../shared/components';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { SocialLoginButtons } from './SocialLoginButtons';

export interface RegisterScreenProps {
  onNavigateToLogin?: () => void;
  onNavigateToOTP?: (destination: string) => void;
}

const RegisterScreenComponent: React.FC<RegisterScreenProps> = ({
  onNavigateToLogin,
  onNavigateToOTP,
}) => {
  const { colors } = useTheme();
  const { login } = useAuthStore();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!name || !email || !password) {
      showToast({ message: 'Please fill in all required fields.', type: 'warning' });
      return;
    }
    if (!agreeTerms) {
      showToast({ message: 'Please agree to the Terms of Service & Privacy Policy.', type: 'warning' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(
        {
          id: `usr_${Date.now()}`,
          username: username || name.toLowerCase().replace(/\s+/g, '_'),
          name,
          email,
          phoneNumber: phone,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          isVerified: false,
          isEmailVerified: false,
          isPhoneVerified: false,
        },
        'token_mock_new',
        'refresh_mock_new'
      );
      setLoading(false);
      showToast({ message: 'Account created! Please verify your email or phone.', type: 'success' });
      onNavigateToOTP?.(email || phone);
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h2" color={colors.text} bold>
            Create Your Account
          </Typography>
          <Typography variant="body2" color={colors.textSecondary}>
            Join millions of creators, builders, and friends worldwide.
          </Typography>
        </View>

        <Card variant="elevated" padding={20} style={[styles.card, { backgroundColor: colors.surface }]}>
          <Input
            label="Full Name"
            placeholder="e.g. Alex Rivera"
            value={name}
            onChangeText={setName}
          />
          <Input
            label="Username"
            placeholder="e.g. alex.rivera"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Input
            label="Email Address"
            placeholder="alex@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Phone Number (Optional)"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Input
            label="Password"
            placeholder="Minimum 8 characters"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <View style={styles.termsRow}>
            <Checkbox
              checked={agreeTerms}
              onChange={setAgreeTerms}
              label="I agree to Terms of Service & Privacy Policy"
            />
          </View>

          <Button
            label="Create Account"
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleRegister}
            fullWidth
            style={styles.regBtn}
          />

          {/* Social Logins */}
          <SocialLoginButtons />
        </Card>

        <View style={styles.footerRow}>
          <Typography variant="body2" color={colors.textSecondary}>
            Already have an account?{' '}
          </Typography>
          <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToLogin}>
            <Typography variant="body2" color={colors.primary} bold>
              Log In
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const RegisterScreen = memo(RegisterScreenComponent);

export const BiometricLockScreen: React.FC = memo(() => {
  const { colors } = useTheme();
  const { unlockWithBiometrics, logout } = useAuthStore();

  return (
    <View style={[styles.lockContainer, { backgroundColor: colors.background }]}>
      <View style={styles.lockContent}>
        <Typography variant="h1" style={styles.lockIcon}>
          🔒
        </Typography>
        <Typography variant="h3" color={colors.text} bold style={styles.lockTitle}>
          App Locked
        </Typography>
        <Typography variant="body1" color={colors.textSecondary} align="center" style={styles.lockDesc}>
          Use Face ID or Touch ID to access your SocialSphere account.
        </Typography>

        <Button
          label="Unlock with Biometrics"
          variant="primary"
          size="lg"
          onPress={unlockWithBiometrics}
          style={styles.unlockBtn}
        />

        <TouchableOpacity activeOpacity={0.7} onPress={logout} style={styles.logoutBtn}>
          <Typography variant="subtitle2" color={colors.danger} bold>
            Log Out
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
});

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
    marginBottom: 20,
  },
  card: {
    marginBottom: 8,
  },
  termsRow: {
    marginVertical: 10,
  },
  regBtn: {
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  lockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  lockContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  lockIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  lockTitle: {
    marginBottom: 8,
  },
  lockDesc: {
    marginBottom: 28,
  },
  unlockBtn: {
    width: '100%',
    marginBottom: 16,
  },
  logoutBtn: {
    padding: 10,
  },
});

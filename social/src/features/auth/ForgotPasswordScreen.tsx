import React, { useState, memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Input, Button } from '../../shared/components';
import { useToast } from '../../shared/components/molecules/Toast';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface ForgotPasswordScreenProps {
  onCodeSent: (destination: string) => void;
  onBackToLogin: () => void;
}

const ForgotPasswordScreenComponent: React.FC<ForgotPasswordScreenProps> = ({
  onCodeSent,
  onBackToLogin,
}) => {
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendResetCode = async () => {
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API request to dispatch security reset code
      setTimeout(() => {
        setIsLoading(false);
        showToast({ message: 'Password reset code dispatched!', type: 'success' });
        onCodeSent(emailOrPhone);
      }, 700);
    } catch {
      setIsLoading(false);
      showToast({ message: 'Failed to send reset code. Try again.', type: 'danger' });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
      >
        <TouchableOpacity
          onPress={onBackToLogin}
          style={styles.backBtn}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Back to login"
        >
          <Typography variant="h3" color={colors.text}>
            ←
          </Typography>
        </TouchableOpacity>

        <View style={styles.header}>
          <Typography variant="h1" color={colors.text} bold>
            Forgot Password?
          </Typography>
          <Typography variant="body1" color={colors.textSecondary} style={styles.subtitle}>
            Enter your registered email address or phone number and we will send you a 6-digit recovery code.
          </Typography>
        </View>

        <Input
          label="Email or Phone Number"
          placeholder="e.g. alex@metaverse.io or +1555..."
          value={emailOrPhone}
          onChangeText={(t) => {
            setEmailOrPhone(t);
            setError('');
          }}
          error={error}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          label="Send Recovery Code"
          loading={isLoading}
          onPress={handleSendResetCode}
          fullWidth
          size="lg"
          style={styles.actionBtn}
        />

        <TouchableOpacity onPress={onBackToLogin} style={styles.backLoginRow}>
          <Typography variant="body2" color={colors.primary} bold>
            Remember your password? Log In
          </Typography>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const ForgotPasswordScreen = memo(ForgotPasswordScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 8,
  },
  header: {
    marginBottom: 28,
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22,
  },
  actionBtn: {
    marginTop: 16,
    marginBottom: 20,
  },
  backLoginRow: {
    alignItems: 'center',
    paddingVertical: 10,
  },
});

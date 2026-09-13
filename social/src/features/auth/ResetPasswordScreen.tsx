import React, { useState, useMemo, memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Input, Button } from '../../shared/components';
import { useToast } from '../../shared/components/molecules/Toast';

export interface ResetPasswordScreenProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

const ResetPasswordScreenComponent: React.FC<ResetPasswordScreenProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { colors, theme } = useTheme();
  const { showToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Password strength calculation
  const strengthScore = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  }, [password]);

  const strengthColor = useMemo(() => {
    if (strengthScore <= 25) return colors.danger;
    if (strengthScore <= 50) return colors.warning;
    if (strengthScore <= 75) return colors.info;
    return colors.success;
  }, [strengthScore, colors]);

  const strengthLabel = useMemo(() => {
    if (strengthScore === 0) return '';
    if (strengthScore <= 25) return 'Weak';
    if (strengthScore <= 50) return 'Fair';
    if (strengthScore <= 75) return 'Good';
    return 'Strong';
  }, [strengthScore]);

  const handleResetPassword = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      setTimeout(() => {
        setIsSubmitting(false);
        showToast({ message: 'Password updated successfully! Please log in.', type: 'success' });
        onSuccess();
      }, 700);
    } catch {
      setIsSubmitting(false);
      showToast({ message: 'Failed to reset password. Try again.', type: 'danger' });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
      >
        {onCancel && (
          <TouchableOpacity onPress={onCancel} style={styles.backBtn}>
            <Typography variant="h3" color={colors.text}>
              ←
            </Typography>
          </TouchableOpacity>
        )}

        <View style={styles.header}>
          <Typography variant="h1" color={colors.text} bold>
            Create New Password
          </Typography>
          <Typography variant="body1" color={colors.textSecondary} style={styles.subtitle}>
            Your new password must be different from previous passwords and contain letters, numbers, and symbols.
          </Typography>
        </View>

        <Input
          label="New Password"
          placeholder="Min 8 characters"
          isPassword
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setError('');
          }}
        />

        {password.length > 0 && (
          <View style={styles.strengthRow}>
            <View style={[styles.strengthTrack, { backgroundColor: colors.inputBg, borderRadius: theme.radius.full }]}>
              <View
                style={[
                  styles.strengthFill,
                  { width: `${strengthScore}%`, backgroundColor: strengthColor, borderRadius: theme.radius.full },
                ]}
              />
            </View>
            <Typography variant="caption" color={strengthColor} bold style={styles.strengthText}>
              {strengthLabel}
            </Typography>
          </View>
        )}

        <Input
          label="Confirm New Password"
          placeholder="Re-enter your password"
          isPassword
          value={confirmPassword}
          onChangeText={(t) => {
            setConfirmPassword(t);
            setError('');
          }}
          error={error}
        />

        <Button
          label="Reset Password"
          loading={isSubmitting}
          onPress={handleResetPassword}
          fullWidth
          size="lg"
          style={styles.submitBtn}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const ResetPasswordScreen = memo(ResetPasswordScreenComponent);

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
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  strengthTrack: {
    flex: 1,
    height: 6,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
  },
  strengthText: {
    marginLeft: 10,
    minWidth: 46,
  },
  submitBtn: {
    marginTop: 16,
  },
});

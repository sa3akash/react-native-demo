import React, { useState, useRef, useEffect, memo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Button } from '../../shared/components';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface OTPScreenProps {
  destination?: string; // Email or phone number
  type?: 'email' | 'phone' | '2fa' | 'reset';
  onSuccess: () => void;
  onBack?: () => void;
}

const OTPScreenComponent: React.FC<OTPScreenProps> = ({
  destination = 'alex.rivera@metaverse.io',
  type = 'email',
  onSuccess,
  onBack,
}) => {
  const { colors, theme } = useTheme();
  const { verifyOTP, verify2FA } = useAuthStore();
  const { showToast } = useToast();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<Array<any>>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleDigitChange = (text: string, index: number) => {
    const clean = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (clean.length > 1) {
      // Handle paste of full 6 digit string
      const pasted = clean.slice(0, 6).split('');
      pasted.forEach((ch, idx) => {
        newOtp[idx] = ch;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
      return;
    }

    newOtp[index] = clean;
    setOtp(newOtp);

    // Auto-advance to next input
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      showToast({ message: 'Please enter the complete 6-digit verification code.', type: 'warning' });
      return;
    }

    setIsVerifying(true);
    try {
      let isSuccess = false;
      if (type === '2fa') {
        isSuccess = await verify2FA(fullCode);
      } else {
        isSuccess = await verifyOTP(fullCode, destination);
      }

      if (isSuccess) {
        showToast({ message: 'Verification successful! 🚀', type: 'success' });
        onSuccess();
      } else {
        showToast({ message: 'Invalid verification code. Please try again.', type: 'danger' });
      }
    } catch {
      showToast({ message: 'Verification failed. Please try again.', type: 'danger' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    showToast({ message: `New verification code sent to ${destination}`, type: 'info' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
      >
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Typography variant="h3" color={colors.text}>
              ←
            </Typography>
          </TouchableOpacity>
        )}

        <View style={styles.header}>
          <Typography variant="h1" color={colors.text} bold>
            {type === '2fa' ? 'Two-Factor Auth' : 'Verify Account'}
          </Typography>
          <Typography variant="body1" color={colors.textSecondary} style={styles.subtitle}>
            Enter the 6-digit verification code sent to{' '}
            <Typography variant="body1" color={colors.primary} bold>
              {destination}
            </Typography>
          </Typography>
        </View>

        {/* 6 Digit Input Boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              value={digit}
              onChangeText={(text) => handleDigitChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={index === 0 ? 6 : 1}
              textAlign="center"
              style={[
                styles.otpBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: digit ? colors.primary : colors.inputBorder,
                  borderRadius: theme.radius.md,
                  color: colors.text,
                },
              ]}
              accessible={true}
              accessibilityLabel={`Digit ${index + 1}`}
            />
          ))}
        </View>

        <Button
          label="Verify & Continue"
          loading={isVerifying}
          onPress={handleVerify}
          fullWidth
          size="lg"
          style={styles.verifyBtn}
        />

        {/* Countdown & Resend */}
        <View style={styles.resendRow}>
          <Typography variant="body2" color={colors.textSecondary}>
            Didn't receive the code?{' '}
          </Typography>
          <TouchableOpacity
            disabled={countdown > 0}
            onPress={handleResend}
            accessible={true}
            accessibilityRole="button"
          >
            <Typography
              variant="subtitle2"
              color={countdown > 0 ? colors.textMuted : colors.primary}
              bold
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </Typography>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const OTPScreen = memo(OTPScreenComponent);

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
    marginBottom: 32,
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    fontSize: 22,
    fontWeight: '700',
  },
  verifyBtn: {
    marginBottom: 20,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

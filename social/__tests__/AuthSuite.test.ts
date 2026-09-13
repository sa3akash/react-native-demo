import { useAuthStore, SocialProvider } from '../src/store/useAuthStore';
import {
  LoginScreen,
  RegisterScreen,
  OTPScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  TwoFactorAuthScreen,
  DeviceManagementScreen,
  SocialLoginButtons,
} from '../src/features/auth';

describe('Enterprise Authentication Suite', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      isAuthenticated: true,
      isBiometricLocked: false,
      pending2FA: false,
    });
  });

  test('All 8 Authentication screens and components are defined and exportable', () => {
    expect(LoginScreen).toBeDefined();
    expect(RegisterScreen).toBeDefined();
    expect(OTPScreen).toBeDefined();
    expect(ForgotPasswordScreen).toBeDefined();
    expect(ResetPasswordScreen).toBeDefined();
    expect(TwoFactorAuthScreen).toBeDefined();
    expect(DeviceManagementScreen).toBeDefined();
    expect(SocialLoginButtons).toBeDefined();
  });

  test('Social login connects with Google, Apple, Facebook, GitHub, and LinkedIn', async () => {
    const providers: SocialProvider[] = ['google', 'apple', 'facebook', 'github', 'linkedin'];

    for (const provider of providers) {
      await useAuthStore.getState().loginWithSocial(provider);
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.id).toContain(provider);
      expect(state.token).toContain(provider);
    }
  });

  test('OTP verification validates 6-digit code and marks email/phone verified', async () => {
    const emailResult = await useAuthStore.getState().verifyOTP('123456', 'alex@example.com');
    expect(emailResult).toBe(true);
    expect(useAuthStore.getState().user?.isEmailVerified).toBe(true);

    const phoneResult = await useAuthStore.getState().verifyOTP('123456', '+15550001111');
    expect(phoneResult).toBe(true);
    expect(useAuthStore.getState().user?.isPhoneVerified).toBe(true);
  });

  test('2FA verification validates TOTP code', async () => {
    useAuthStore.setState({ pending2FA: true, isAuthenticated: false });
    const success = await useAuthStore.getState().verify2FA('123456');
    expect(success).toBe(true);
    expect(useAuthStore.getState().pending2FA).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  test('Device management lists active sessions, revokes session, and terminates other sessions', () => {
    const initialCount = useAuthStore.getState().activeSessions.length;
    expect(initialCount).toBeGreaterThanOrEqual(3);

    // Revoke a specific session
    useAuthStore.getState().terminateSession('sess_2');
    const remaining = useAuthStore.getState().activeSessions.find((s) => s.id === 'sess_2');
    expect(remaining).toBeUndefined();

    // Terminate all other sessions
    useAuthStore.getState().terminateAllOtherSessions();
    const activeSessions = useAuthStore.getState().activeSessions;
    expect(activeSessions).toHaveLength(1);
    expect(activeSessions[0].isCurrent).toBe(true);
  });

  test('Biometric lock and unlock toggle', async () => {
    useAuthStore.getState().setBiometricLock(true);
    expect(useAuthStore.getState().isBiometricLocked).toBe(true);

    const unlocked = await useAuthStore.getState().unlockWithBiometrics();
    expect(unlocked).toBe(true);
    expect(useAuthStore.getState().isBiometricLocked).toBe(false);
  });
});

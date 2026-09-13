import * as Keychain from 'react-native-keychain';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const AUTH_SERVICE_KEY = 'com.socialsphere.auth_tokens';

class KeychainService {
  /**
   * Securely saves access token and refresh token in device Keychain / Android KeyStore.
   * @param accessToken Bearer access token
   * @param refreshToken OAuth refresh token
   * @param requireBiometrics Optional biometric security requirement on retrieval
   */
  public async setAuthTokens(
    accessToken: string,
    refreshToken: string,
    requireBiometrics: boolean = false
  ): Promise<boolean> {
    try {
      const options: Keychain.SetOptions = {
        service: AUTH_SERVICE_KEY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
      };

      if (requireBiometrics) {
        options.accessControl = Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE;
      }

      // Store accessToken as username, refreshToken as password in Keychain generic password vault
      const result = await Keychain.setGenericPassword(
        accessToken,
        refreshToken,
        options
      );

      return Boolean(result);
    } catch (error) {
      console.warn('[KeychainService] Failed to set auth tokens:', error);
      return false;
    }
  }

  /**
   * Retrieves access token and refresh token securely from Keychain.
   */
  public async getAuthTokens(): Promise<AuthTokens | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: AUTH_SERVICE_KEY,
      });

      if (credentials && credentials.username && credentials.password) {
        return {
          accessToken: credentials.username,
          refreshToken: credentials.password,
        };
      }
      return null;
    } catch (error) {
      console.warn('[KeychainService] Failed to get auth tokens:', error);
      return null;
    }
  }

  /**
   * Retrieves only the current access token.
   */
  public async getAccessToken(): Promise<string | null> {
    const tokens = await this.getAuthTokens();
    return tokens?.accessToken || null;
  }

  /**
   * Retrieves only the current refresh token.
   */
  public async getRefreshToken(): Promise<string | null> {
    const tokens = await this.getAuthTokens();
    return tokens?.refreshToken || null;
  }

  /**
   * Clears auth tokens from Keychain upon user logout or session expiration.
   */
  public async clearAuthTokens(): Promise<boolean> {
    try {
      return await Keychain.resetGenericPassword({
        service: AUTH_SERVICE_KEY,
      });
    } catch (error) {
      console.warn('[KeychainService] Failed to clear auth tokens:', error);
      return false;
    }
  }

  /**
   * Check if hardware-backed Keychain security is available on this device.
   */
  public async getSupportedBiometryType(): Promise<Keychain.BIOMETRY_TYPE | null> {
    try {
      return await Keychain.getSupportedBiometryType();
    } catch {
      return null;
    }
  }
}

export const keychainService = new KeychainService();

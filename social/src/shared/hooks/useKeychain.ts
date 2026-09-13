import { useState, useCallback, useEffect } from 'react';
import { keychainService, AuthTokens } from '../../core/security/KeychainService';
import * as Keychain from 'react-native-keychain';

export function useKeychain() {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [biometryType, setBiometryType] = useState<Keychain.BIOMETRY_TYPE | null>(null);

  const loadTokens = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedTokens = await keychainService.getAuthTokens();
      const biometry = await keychainService.getSupportedBiometryType();
      setTokens(storedTokens);
      setBiometryType(biometry);
      return storedTokens;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  const saveTokens = useCallback(
    async (accessToken: string, refreshToken: string, requireBiometrics = false): Promise<boolean> => {
      const success = await keychainService.setAuthTokens(accessToken, refreshToken, requireBiometrics);
      if (success) {
        setTokens({ accessToken, refreshToken });
      }
      return success;
    },
    []
  );

  const clearTokens = useCallback(async (): Promise<boolean> => {
    const success = await keychainService.clearAuthTokens();
    if (success) {
      setTokens(null);
    }
    return success;
  }, []);

  return {
    tokens,
    accessToken: tokens?.accessToken || null,
    refreshToken: tokens?.refreshToken || null,
    hasTokens: Boolean(tokens?.accessToken),
    biometryType,
    isLoading,
    saveTokens,
    clearTokens,
    reload: loadTokens,
  };
}

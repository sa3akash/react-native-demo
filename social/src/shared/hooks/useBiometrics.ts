import { useState, useEffect, useCallback } from 'react';
import { biometricsService, BiometricType } from '../../core/security/BiometricsService';

export function useBiometrics() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<BiometricType>('None');
  const [isLockEnabled, setIsLockEnabled] = useState(biometricsService.isBiometricLockEnabled());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkSupport() {
      try {
        const available = await biometricsService.isBiometricsAvailable();
        const type = await biometricsService.getSupportedType();
        setIsAvailable(available);
        setBiometricType(type);
      } finally {
        setIsLoading(false);
      }
    }
    checkSupport();
  }, []);

  const authenticate = useCallback(async (promptMessage?: string): Promise<boolean> => {
    try {
      return await biometricsService.authenticate(promptMessage);
    } catch {
      return false;
    }
  }, []);

  const toggleBiometricLock = useCallback((enabled: boolean) => {
    biometricsService.setBiometricLockEnabled(enabled);
    setIsLockEnabled(enabled);
  }, []);

  return {
    isAvailable,
    biometricType,
    isLockEnabled,
    isLoading,
    authenticate,
    toggleBiometricLock,
  };
}

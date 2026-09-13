import { useState, useEffect, useCallback } from 'react';
import { securityService, DeviceSecurityStatus } from '../../core/security/SecurityService';

export function useDeviceSecurity() {
  const [securityStatus, setSecurityStatus] = useState<DeviceSecurityStatus | null>(null);
  const [isAuditing, setIsAuditing] = useState(true);

  const runAudit = useCallback(async () => {
    setIsAuditing(true);
    try {
      const status = await securityService.checkDeviceIntegrity();
      setSecurityStatus(status);
    } catch (err) {
      console.warn('[useDeviceSecurity] Security audit encountered an issue:', err);
    } finally {
      setIsAuditing(false);
    }
  }, []);

  useEffect(() => {
    runAudit();
  }, [runAudit]);

  return {
    securityStatus,
    isAuditing,
    isDeviceCompromised: Boolean(securityStatus?.isRootedOrJailbroken || securityStatus?.isHookedOrInstrumented),
    securityScore: securityStatus?.securityScore ?? 100,
    fingerprint: securityStatus?.fingerprint ?? '',
    reAudit: runAudit,
  };
}

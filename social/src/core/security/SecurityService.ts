import { deviceSecurityService, SecurityReport } from './DeviceSecurityService';
import { deviceFingerprintService, DeviceFingerprintData } from './DeviceFingerprintService';
import { sslPinningService } from './SSLPinningService';
import { keychainService } from './KeychainService';
import { biometricsService } from './BiometricsService';

export interface DeviceSecurityStatus extends SecurityReport {
  deviceId: string;
  fingerprint: string;
  fingerprintDetails: DeviceFingerprintData;
  hasSecureHardware: boolean;
}

class SecurityService {
  public async checkDeviceIntegrity(): Promise<DeviceSecurityStatus> {
    const [auditReport, fingerprintData, biometryType] = await Promise.all([
      deviceSecurityService.performSecurityAudit(),
      deviceFingerprintService.getDeviceFingerprint(),
      keychainService.getSupportedBiometryType(),
    ]);

    return {
      ...auditReport,
      deviceId: fingerprintData.installationId,
      fingerprint: fingerprintData.fingerprintId,
      fingerprintDetails: fingerprintData,
      hasSecureHardware: Boolean(biometryType),
    };
  }

  public async getDeviceId(): Promise<string> {
    const fp = await deviceFingerprintService.getDeviceFingerprint();
    return fp.installationId;
  }

  public sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  }

  public get ssl() {
    return sslPinningService;
  }

  public get biometrics() {
    return biometricsService;
  }

  public get keychain() {
    return keychainService;
  }
}

export const securityService = new SecurityService();

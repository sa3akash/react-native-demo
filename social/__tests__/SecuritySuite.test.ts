import { securityService } from '../src/core/security/SecurityService';
import { sslPinningService } from '../src/core/security/SSLPinningService';
import { deviceSecurityService } from '../src/core/security/DeviceSecurityService';
import { deviceFingerprintService } from '../src/core/security/DeviceFingerprintService';
import { biometricsService } from '../src/core/security/BiometricsService';

describe('Enterprise Security & Hardware Defense Suite', () => {
  test('SSLPinningService enforces known domain certificates and rejects invalid pins', () => {
    // Known domain should return certified pins
    const pins = sslPinningService.getPinsForUrl('https://api.socialsphere.enterprise/v1/feed');
    expect(pins.length).toBeGreaterThan(0);
    expect(pins[0]).toContain('sha256/');

    // Valid hash passes
    const valid = sslPinningService.validateCertificate(
      'api.socialsphere.enterprise',
      'sha256/k20YWjR6T/E2s5fU9xM5+5J8o+G/Z6lJ6i8k9lM4nO0='
    );
    expect(valid).toBe(true);

    // Tampered/MitM hash is rejected
    const tampered = sslPinningService.validateCertificate(
      'api.socialsphere.enterprise',
      'sha256/FAKE_MITM_ATTACKER_CERT_HASH_XYZ='
    );
    expect(tampered).toBe(false);
  });

  test('DeviceFingerprintService produces unique deterministic device hash and token', async () => {
    const fp1 = await deviceFingerprintService.getDeviceFingerprint();
    const fp2 = await deviceFingerprintService.getDeviceFingerprint();

    expect(fp1.fingerprintId).toBeDefined();
    expect(fp1.fingerprintId).toMatch(/^fp_/);
    expect(fp1.installationId).toBeDefined();
    expect(fp1.fingerprintId).toBe(fp2.fingerprintId); // Deterministic stability
  });

  test('DeviceSecurityService runs anti-tamper audit report', async () => {
    const report = await deviceSecurityService.performSecurityAudit();
    expect(report.securityScore).toBeGreaterThanOrEqual(0);
    expect(report.securityScore).toBeLessThanOrEqual(100);
    expect(Array.isArray(report.threatDetails)).toBe(true);
  });

  test('BiometricsService manages biometric lock preferences and prompts', async () => {
    biometricsService.setBiometricLockEnabled(true);
    expect(biometricsService.isBiometricLockEnabled()).toBe(true);

    biometricsService.setBiometricLockEnabled(false);
    expect(biometricsService.isBiometricLockEnabled()).toBe(false);

    const authResult = await biometricsService.authenticate('Test authentication');
    expect(authResult).toBe(true);
  });

  test('SecurityService coordinates full device integrity audit', async () => {
    const status = await securityService.checkDeviceIntegrity();
    expect(status.deviceId).toBeDefined();
    expect(status.fingerprint).toBeDefined();
    expect(status.securityScore).toBeDefined();
  });
});

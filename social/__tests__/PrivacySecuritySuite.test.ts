import { usePrivacySecurityStore } from '../src/store/usePrivacySecurityStore';
import { changeLanguage, resources } from '../src/locales/i18n';
import i18n from '../src/locales/i18n';

describe('Enterprise Privacy, Security, Accessibility & Localization Suite', () => {
  beforeEach(() => {
    // Reset state before each test
  });

  test('Manages Privacy Settings (Public, Friends, Private, Custom Audience)', () => {
    // 1. Set Audience to Custom
    usePrivacySecurityStore.getState().setPostAudience('custom');
    expect(usePrivacySecurityStore.getState().privacy.defaultPostAudience).toBe('custom');

    // 2. Set Custom Whitelist
    usePrivacySecurityStore.getState().setCustomWhitelist(['usr_10', 'usr_11', 'usr_12']);
    expect(usePrivacySecurityStore.getState().privacy.customWhitelistUserIds.length).toBe(3);

    // 3. Update Profile Visibility and Messaging permissions
    usePrivacySecurityStore.getState().updatePrivacySettings({
      profileVisibility: 'friends',
      whoCanMessageMe: 'friends',
      allowSearchIndexing: false,
    });

    const { privacy } = usePrivacySecurityStore.getState();
    expect(privacy.profileVisibility).toBe('friends');
    expect(privacy.whoCanMessageMe).toBe('friends');
    expect(privacy.allowSearchIndexing).toBe(false);
  });

  test('Manages Security, Active Devices & Login History', () => {
    const initialDevices = usePrivacySecurityStore.getState().security.activeDevices;
    expect(initialDevices.length).toBeGreaterThan(0);

    // Terminate single device
    const nonCurrentDev = initialDevices.find((d) => !d.isCurrent);
    if (nonCurrentDev) {
      usePrivacySecurityStore.getState().terminateDevice(nonCurrentDev.id);
      expect(
        usePrivacySecurityStore.getState().security.activeDevices.some((d) => d.id === nonCurrentDev.id)
      ).toBe(false);
    }

    // Terminate all other devices
    usePrivacySecurityStore.getState().terminateAllOtherDevices();
    const remaining = usePrivacySecurityStore.getState().security.activeDevices;
    expect(remaining.every((d) => d.isCurrent)).toBe(true);

    // Login History check
    const loginHistory = usePrivacySecurityStore.getState().security.loginHistory;
    expect(loginHistory.length).toBeGreaterThan(0);
    expect(loginHistory[0].ip).toBeDefined();

    // Security Audit log
    const auditLogs = usePrivacySecurityStore.getState().security.auditLogs;
    expect(auditLogs.length).toBeGreaterThan(0);
  });

  test('Manages Accessibility: Font Scaling, High Contrast, Reduce Motion', () => {
    // Dynamic Font Scaling
    usePrivacySecurityStore.getState().setFontSizeScale('extra_large');
    expect(usePrivacySecurityStore.getState().accessibility.fontSizeScale).toBe('extra_large');

    // High Contrast Mode
    usePrivacySecurityStore.getState().toggleHighContrast();
    expect(usePrivacySecurityStore.getState().accessibility.highContrastMode).toBe(true);

    // Reduce Motion
    usePrivacySecurityStore.getState().toggleReduceMotion();
    expect(usePrivacySecurityStore.getState().accessibility.reduceMotion).toBe(true);
  });

  test('Validates Multi-Language & RTL Localization Engine', async () => {
    // English
    await changeLanguage('en');
    expect(i18n.language).toBe('en');
    expect(resources.en.translation.settings).toBe('Settings');

    // Spanish
    await changeLanguage('es');
    expect(i18n.language).toBe('es');
    expect(resources.es.translation.settings).toBe('Ajustes');

    // Arabic RTL
    await changeLanguage('ar');
    expect(i18n.language).toBe('ar');
    expect(resources.ar.translation.settings).toBe('الإعدادات');

    // Restore to English
    await changeLanguage('en');
  });
});

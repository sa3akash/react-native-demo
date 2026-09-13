import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { zustandMMKVStorage } from '../core/storage/StorageService';

export type PostAudience = 'public' | 'friends' | 'private' | 'custom';
export type ProfileVisibility = 'everyone' | 'friends' | 'private';
export type MessagePermission = 'everyone' | 'friends' | 'nobody';
export type FontSizeScale = 'normal' | 'large' | 'extra_large';

export interface LoginHistoryEntry {
  id: string;
  device: string;
  location: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'failed';
}

export interface ActiveDeviceSession {
  id: string;
  name: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  lastActive: string;
  isCurrent: boolean;
  location: string;
  ip: string;
}

export interface SecurityAuditLog {
  id: string;
  action: string;
  category: 'auth' | 'privacy' | 'security' | 'account';
  timestamp: string;
  details: string;
}

export interface PrivacySecurityState {
  // Privacy
  privacy: {
    defaultPostAudience: PostAudience;
    customWhitelistUserIds: string[];
    customBlacklistUserIds: string[];
    profileVisibility: ProfileVisibility;
    allowSearchIndexing: boolean;
    whoCanMessageMe: MessagePermission;
    readReceiptsEnabled: boolean;
    onlineStatusVisible: boolean;
  };

  // Security & Devices
  security: {
    twoFactorEnabled: boolean;
    biometricLockEnabled: boolean;
    loginHistory: LoginHistoryEntry[];
    activeDevices: ActiveDeviceSession[];
    auditLogs: SecurityAuditLog[];
  };

  // Accessibility
  accessibility: {
    fontSizeScale: FontSizeScale;
    highContrastMode: boolean;
    reduceMotion: boolean;
    screenReaderAnnouncements: boolean;
  };

  // Actions - Privacy
  setPostAudience: (audience: PostAudience) => void;
  setCustomWhitelist: (userIds: string[]) => void;
  setCustomBlacklist: (userIds: string[]) => void;
  updatePrivacySettings: (partial: Partial<PrivacySecurityState['privacy']>) => void;

  // Actions - Security
  terminateDevice: (deviceId: string) => void;
  terminateAllOtherDevices: () => void;
  logSecurityEvent: (action: string, category: SecurityAuditLog['category'], details: string) => void;

  // Actions - Accessibility
  setFontSizeScale: (scale: FontSizeScale) => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  toggleScreenReaderAnnouncements: () => void;
}

const INITIAL_LOGIN_HISTORY: LoginHistoryEntry[] = [
  {
    id: 'log_1',
    device: 'iPhone 16 Pro Max (iOS 19.1)',
    location: 'San Francisco, CA, USA',
    ip: '198.51.100.42',
    timestamp: 'Today at 09:14 AM',
    status: 'success',
  },
  {
    id: 'log_2',
    device: 'MacBook Pro M3 Max (macOS Tahoe)',
    location: 'San Francisco, CA, USA',
    ip: '198.51.100.42',
    timestamp: 'Yesterday at 04:22 PM',
    status: 'success',
  },
  {
    id: 'log_3',
    device: 'Windows 11 PC (Chrome 134)',
    location: 'Frankfurt, Germany',
    ip: '82.165.197.1',
    timestamp: 'Aug 21, 2026 at 02:11 AM',
    status: 'failed',
  },
];

const INITIAL_DEVICES: ActiveDeviceSession[] = [
  {
    id: 'dev_curr',
    name: 'iPhone 16 Pro Max',
    deviceType: 'mobile',
    lastActive: 'Active Now',
    isCurrent: true,
    location: 'San Francisco, CA',
    ip: '198.51.100.42',
  },
  {
    id: 'dev_mbp',
    name: 'MacBook Pro M3 Max',
    deviceType: 'desktop',
    lastActive: '2 hours ago',
    isCurrent: false,
    location: 'San Francisco, CA',
    ip: '198.51.100.42',
  },
  {
    id: 'dev_ipad',
    name: 'iPad Pro 13-inch M4',
    deviceType: 'tablet',
    lastActive: '3 days ago',
    isCurrent: false,
    location: 'San Jose, CA',
    ip: '198.51.100.88',
  },
];

const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'aud_1',
    action: '2-Factor Authentication Enabled',
    category: 'security',
    timestamp: 'Aug 20, 2026 at 11:30 AM',
    details: 'Hardware Security Key (FIDO2) added to account',
  },
  {
    id: 'aud_2',
    action: 'Privacy Audience Updated',
    category: 'privacy',
    timestamp: 'Aug 18, 2026 at 08:45 PM',
    details: 'Default post visibility changed to Custom Audience',
  },
  {
    id: 'aud_3',
    action: 'Password Changed',
    category: 'auth',
    timestamp: 'Aug 10, 2026 at 03:15 PM',
    details: 'Password updated via authenticated session',
  },
];

export const usePrivacySecurityStore = create<PrivacySecurityState>()(
  persist(
    (set, get) => ({
      privacy: {
        defaultPostAudience: 'public',
        customWhitelistUserIds: ['usr_1', 'usr_2'],
        customBlacklistUserIds: [],
        profileVisibility: 'everyone',
        allowSearchIndexing: true,
        whoCanMessageMe: 'everyone',
        readReceiptsEnabled: true,
        onlineStatusVisible: true,
      },

      security: {
        twoFactorEnabled: true,
        biometricLockEnabled: true,
        loginHistory: INITIAL_LOGIN_HISTORY,
        activeDevices: INITIAL_DEVICES,
        auditLogs: INITIAL_AUDIT_LOGS,
      },

      accessibility: {
        fontSizeScale: 'normal',
        highContrastMode: false,
        reduceMotion: false,
        screenReaderAnnouncements: true,
      },

      setPostAudience: (audience) => {
        set(
          produce((state: PrivacySecurityState) => {
            state.privacy.defaultPostAudience = audience;
          })
        );
        get().logSecurityEvent('Post Audience Changed', 'privacy', `Audience set to ${audience}`);
      },

      setCustomWhitelist: (userIds) => {
        set(
          produce((state: PrivacySecurityState) => {
            state.privacy.customWhitelistUserIds = userIds;
          })
        );
      },

      setCustomBlacklist: (userIds) => {
        set(
          produce((state: PrivacySecurityState) => {
            state.privacy.customBlacklistUserIds = userIds;
          })
        );
      },

      updatePrivacySettings: (partial) => {
        set(
          produce((state: PrivacySecurityState) => {
            state.privacy = { ...state.privacy, ...partial };
          })
        );
      },

      terminateDevice: (deviceId) => {
        set(
          produce((state: PrivacySecurityState) => {
            state.security.activeDevices = state.security.activeDevices.filter((d) => d.id !== deviceId);
          })
        );
        get().logSecurityEvent('Session Terminated', 'security', `Terminated device session ID ${deviceId}`);
      },

      terminateAllOtherDevices: () => {
        set(
          produce((state: PrivacySecurityState) => {
            state.security.activeDevices = state.security.activeDevices.filter((d) => d.isCurrent);
          })
        );
        get().logSecurityEvent('All Other Sessions Terminated', 'security', 'Logged out of all remote active devices');
      },

      logSecurityEvent: (action, category, details) => {
        const newLog: SecurityAuditLog = {
          id: `aud_${Date.now()}`,
          action,
          category,
          timestamp: 'Just now',
          details,
        };

        set(
          produce((state: PrivacySecurityState) => {
            state.security.auditLogs.unshift(newLog);
          })
        );
      },

      setFontSizeScale: (scale) => {
        set(
          produce((state: PrivacySecurityState) => {
            state.accessibility.fontSizeScale = scale;
          })
        );
      },

      toggleHighContrast: () => {
        set(
          produce((state: PrivacySecurityState) => {
            state.accessibility.highContrastMode = !state.accessibility.highContrastMode;
          })
        );
      },

      toggleReduceMotion: () => {
        set(
          produce((state: PrivacySecurityState) => {
            state.accessibility.reduceMotion = !state.accessibility.reduceMotion;
          })
        );
      },

      toggleScreenReaderAnnouncements: () => {
        set(
          produce((state: PrivacySecurityState) => {
            state.accessibility.screenReaderAnnouncements = !state.accessibility.screenReaderAnnouncements;
          })
        );
      },
    }),
    {
      name: 'privacy-security-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        privacy: state.privacy,
        security: {
          twoFactorEnabled: state.security.twoFactorEnabled,
          biometricLockEnabled: state.security.biometricLockEnabled,
          activeDevices: state.security.activeDevices,
          auditLogs: state.security.auditLogs,
          loginHistory: state.security.loginHistory,
        },
        accessibility: state.accessibility,
      }),
    }
  )
);

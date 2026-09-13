import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { storageService, zustandMMKVStorage } from '../core/storage/StorageService';
import { keychainService } from '../core/security/KeychainService';
import { eventBus } from '../core/events/EventBus';
import { biometricsService } from '../core/security/BiometricsService';

export type SocialProvider = 'google' | 'apple' | 'facebook' | 'github' | 'linkedin';

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  description?: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  instagram?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  location?: string;
  website?: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'followers';
  showActivityStatus: boolean;
  showReadReceipts: boolean;
  allowTagging: 'everyone' | 'followers' | 'none';
  allowDirectMessages: 'everyone' | 'followers' | 'none';
  searchEngineIndexing: boolean;
}

export interface ModeratedUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  date: string;
  reason?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  phoneNumber?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  avatarUrl: string;
  coverUrl?: string;
  headline?: string;
  bio?: string;
  workHistory?: WorkExperience[];
  education?: EducationItem[];
  skills?: string[];
  socialLinks?: SocialLinks;
  contactInfo?: ContactInfo;
  website?: string;
  location?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified?: boolean;
  twoFactorEnabled?: boolean;
  privacySettings?: PrivacySettings;
}

export interface ActiveSession {
  id: string;
  deviceName: string;
  deviceType: 'ios' | 'android' | 'web' | 'desktop';
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isBiometricLocked: boolean;
  activeSessions: ActiveSession[];
  pending2FA: boolean;
  blockedUsers: ModeratedUser[];
  mutedUsers: ModeratedUser[];
  restrictedUsers: ModeratedUser[];

  // Auth actions
  login: (user: UserProfile, token: string, refreshToken: string) => Promise<void>;
  loginWithSocial: (provider: SocialProvider) => Promise<void>;
  verifyOTP: (code: string, destination: string) => Promise<boolean>;
  verify2FA: (code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  unlockWithBiometrics: () => Promise<boolean>;
  setBiometricLock: (locked: boolean) => void;
  terminateSession: (sessionId: string) => void;
  terminateAllOtherSessions: () => void;

  // Moderation actions
  blockUser: (user: Omit<ModeratedUser, 'date'>) => void;
  unblockUser: (userId: string) => void;
  muteUser: (user: Omit<ModeratedUser, 'date'>) => void;
  unmuteUser: (userId: string) => void;
  restrictUser: (user: Omit<ModeratedUser, 'date'>) => void;
  unrestrictUser: (userId: string) => void;
}

const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  profileVisibility: 'public',
  showActivityStatus: true,
  showReadReceipts: true,
  allowTagging: 'everyone',
  allowDirectMessages: 'everyone',
  searchEngineIndexing: true,
};

const mockUser: UserProfile = {
  id: 'usr_meta_998',
  username: 'alex.rivera',
  name: 'Alex Rivera',
  email: 'alex.rivera@metaverse.io',
  phoneNumber: '+1 (555) 382-9912',
  isEmailVerified: true,
  isPhoneVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
  headline: 'Senior Principal Engineer • Open Source Enthusiast',
  bio: 'Building the next generation of social platforms & distributed systems. 🚀 React Native, TypeScript, Rust, WebRTC.',
  location: 'San Francisco, CA',
  website: 'https://alexrivera.dev',
  workHistory: [
    { id: 'work_1', company: 'Meta Platforms', role: 'Staff Software Engineer', period: '2022 - Present', location: 'Menlo Park, CA', description: 'Leading New Architecture mobile infrastructure & Fabric/TurboModules.' },
    { id: 'work_2', company: 'Stripe', role: 'Senior Software Engineer', period: '2019 - 2022', location: 'San Francisco, CA', description: 'Architected high-throughput mobile checkout SDKs.' },
  ],
  education: [
    { id: 'edu_1', school: 'Stanford University', degree: 'B.S. in Computer Science', year: '2015 - 2019' },
  ],
  skills: ['React Native', 'TypeScript', 'WebRTC', 'Zustand', 'Distributed Systems', 'DDD Architecture', 'GraphQL', 'Rust'],
  socialLinks: {
    github: 'https://github.com/alexrivera',
    twitter: 'https://x.com/alexrivera_dev',
    linkedin: 'https://linkedin.com/in/alexrivera-dev',
    youtube: 'https://youtube.com/@alexriveracodes',
  },
  contactInfo: {
    email: 'alex.rivera@metaverse.io',
    phone: '+1 (555) 382-9912',
    location: 'San Francisco, CA',
    website: 'https://alexrivera.dev',
  },
  followersCount: 14200,
  followingCount: 680,
  postsCount: 184,
  isVerified: true,
  twoFactorEnabled: true,
  privacySettings: DEFAULT_PRIVACY_SETTINGS,
};

const INITIAL_SESSIONS: ActiveSession[] = [
  { id: 'sess_1', deviceName: 'iPhone 16 Pro Max (Current)', deviceType: 'ios', ipAddress: '192.168.1.42', location: 'San Francisco, CA', lastActive: 'Active Now', isCurrent: true },
  { id: 'sess_2', deviceName: 'MacBook Pro 16" M3', deviceType: 'desktop', ipAddress: '192.168.1.10', location: 'San Francisco, CA', lastActive: '2 hours ago', isCurrent: false },
  { id: 'sess_3', deviceName: 'iPad Air 5th Gen', deviceType: 'ios', ipAddress: '10.0.0.8', location: 'San Jose, CA', lastActive: 'Yesterday', isCurrent: false },
  { id: 'sess_4', deviceName: 'Chrome on Windows 11', deviceType: 'web', ipAddress: '172.56.21.9', location: 'Austin, TX', lastActive: '3 days ago', isCurrent: false },
];

const INITIAL_BLOCKED: ModeratedUser[] = [
  { id: 'usr_spammer_1', name: 'Crypto Bot 99', username: 'free_crypto_airdrop', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', date: 'Aug 12, 2026', reason: 'Spam comments' },
];

const INITIAL_MUTED: ModeratedUser[] = [
  { id: 'usr_muted_1', name: 'Daily News Feed', username: 'dailynews_247', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200', date: 'Aug 18, 2026' },
];

const INITIAL_RESTRICTED: ModeratedUser[] = [
  { id: 'usr_restricted_1', name: 'Unknown Contact', username: 'random_user_88', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', date: 'Aug 20, 2026', reason: 'Unsolicited direct messages' },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: mockUser,
      token: 'jwt_mock_token_social_sphere_enterprise',
      refreshToken: 'refresh_mock_token_social_sphere_enterprise',
      isAuthenticated: true,
      isBiometricLocked: false,
      activeSessions: INITIAL_SESSIONS,
      pending2FA: false,
      blockedUsers: INITIAL_BLOCKED,
      mutedUsers: INITIAL_MUTED,
      restrictedUsers: INITIAL_RESTRICTED,

      login: async (user, token, refreshToken) => {
        await keychainService.setAuthTokens(token, refreshToken);
        storageService.setItem('auth_token', token);
        storageService.setItem('refresh_token', refreshToken);
        storageService.setItem('auth_user', user);

        set(
          produce((state: AuthState) => {
            state.user = user;
            state.token = token;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
            state.isBiometricLocked = false;
            state.pending2FA = false;
          })
        );

        eventBus.emit('AUTH:LOGIN', { userId: user.id, token });
      },

      loginWithSocial: async (provider: SocialProvider) => {
        const socialUser: UserProfile = {
          ...mockUser,
          id: `usr_${provider}_${Date.now().toString(36)}`,
          email: `alex.${provider}@socialsphere.io`,
          headline: `Connected via ${provider.toUpperCase()}`,
        };
        const token = `jwt_${provider}_token_${Date.now()}`;
        const refreshToken = `refresh_${provider}_token_${Date.now()}`;

        await get().login(socialUser, token, refreshToken);
      },

      verifyOTP: async (code: string, destination: string) => {
        if (code === '123456' || code.length === 6) {
          set(
            produce((state: AuthState) => {
              if (state.user) {
                if (destination.includes('@')) {
                  state.user.isEmailVerified = true;
                } else {
                  state.user.isPhoneVerified = true;
                }
              }
            })
          );
          return true;
        }
        return false;
      },

      verify2FA: async (code: string) => {
        if (code === '123456' || code.length === 6) {
          set({ pending2FA: false, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: async () => {
        await keychainService.clearAuthTokens();
        storageService.removeItem('auth_token');
        storageService.removeItem('refresh_token');
        storageService.removeItem('auth_user');

        set(
          produce((state: AuthState) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isBiometricLocked = false;
            state.pending2FA = false;
          })
        );

        eventBus.emit('AUTH:LOGOUT', { reason: 'User logged out' });
      },

      updateProfile: (updates) => {
        set(
          produce((state: AuthState) => {
            if (state.user) {
              state.user = { ...state.user, ...updates };
              storageService.setItem('auth_user', state.user);
            }
          })
        );
      },

      updatePrivacySettings: (settings) => {
        set(
          produce((state: AuthState) => {
            if (state.user) {
              state.user.privacySettings = {
                ...(state.user.privacySettings || DEFAULT_PRIVACY_SETTINGS),
                ...settings,
              };
              storageService.setItem('auth_user', state.user);
            }
          })
        );
      },

      unlockWithBiometrics: async () => {
        try {
          const ok = await biometricsService.authenticate();
          if (ok) {
            set({ isBiometricLocked: false });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      setBiometricLock: (locked) => {
        set({ isBiometricLocked: locked });
      },

      terminateSession: (sessionId) => {
        set(
          produce((state: AuthState) => {
            state.activeSessions = state.activeSessions.filter((s) => s.id !== sessionId);
          })
        );
      },

      terminateAllOtherSessions: () => {
        set(
          produce((state: AuthState) => {
            state.activeSessions = state.activeSessions.filter((s) => s.isCurrent);
          })
        );
      },

      blockUser: (user) => {
        set(
          produce((state: AuthState) => {
            if (!state.blockedUsers.some((u) => u.id === user.id)) {
              state.blockedUsers.push({ ...user, date: 'Just now' });
            }
            state.mutedUsers = state.mutedUsers.filter((u) => u.id !== user.id);
            state.restrictedUsers = state.restrictedUsers.filter((u) => u.id !== user.id);
          })
        );
      },

      unblockUser: (userId) => {
        set(
          produce((state: AuthState) => {
            state.blockedUsers = state.blockedUsers.filter((u) => u.id !== userId);
          })
        );
      },

      muteUser: (user) => {
        set(
          produce((state: AuthState) => {
            if (!state.mutedUsers.some((u) => u.id === user.id)) {
              state.mutedUsers.push({ ...user, date: 'Just now' });
            }
          })
        );
      },

      unmuteUser: (userId) => {
        set(
          produce((state: AuthState) => {
            state.mutedUsers = state.mutedUsers.filter((u) => u.id !== userId);
          })
        );
      },

      restrictUser: (user) => {
        set(
          produce((state: AuthState) => {
            if (!state.restrictedUsers.some((u) => u.id === user.id)) {
              state.restrictedUsers.push({ ...user, date: 'Just now' });
            }
          })
        );
      },

      unrestrictUser: (userId) => {
        set(
          produce((state: AuthState) => {
            state.restrictedUsers = state.restrictedUsers.filter((u) => u.id !== userId);
          })
        );
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        activeSessions: state.activeSessions,
        blockedUsers: state.blockedUsers,
        mutedUsers: state.mutedUsers,
        restrictedUsers: state.restrictedUsers,
      }),
    }
  )
);

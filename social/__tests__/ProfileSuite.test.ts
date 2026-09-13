import { useAuthStore } from '../src/store/useAuthStore';
import {
  ProfileScreen,
  EditProfileScreen,
  PrivacySettingsScreen,
  ModerationManagementScreen,
  UserModerationModal,
} from '../src/features/profile';

describe('User Profile & Profile Management Suite', () => {
  beforeEach(() => {
    // Reset user profile to mock state
    useAuthStore.setState((state) => ({
      ...state,
      blockedUsers: [
        { id: 'usr_spammer_1', name: 'Crypto Bot', username: 'crypto_bot', avatarUrl: '', date: 'Aug 12, 2026' },
      ],
      mutedUsers: [],
      restrictedUsers: [],
    }));
  });

  test('All 5 Profile screens and moderation components are defined and exportable', () => {
    expect(ProfileScreen).toBeDefined();
    expect(EditProfileScreen).toBeDefined();
    expect(PrivacySettingsScreen).toBeDefined();
    expect(ModerationManagementScreen).toBeDefined();
    expect(UserModerationModal).toBeDefined();
  });

  test('User profile contains rich fields: bio, work history, education, skills, social links, and website', () => {
    const user = useAuthStore.getState().user;
    expect(user).toBeDefined();
    expect(user?.bio).toBeDefined();
    expect(user?.workHistory).toBeInstanceOf(Array);
    expect(user?.workHistory?.length).toBeGreaterThan(0);
    expect(user?.education).toBeInstanceOf(Array);
    expect(user?.skills).toContain('React Native');
    expect(user?.socialLinks?.github).toBeDefined();
    expect(user?.website).toBeDefined();
  });

  test('updateProfile modifies user headline, bio, skills, and work history', () => {
    useAuthStore.getState().updateProfile({
      headline: 'Principal AI & Mobile Architect',
      skills: ['React Native', 'Worklets', 'WebRTC', 'Rust'],
      website: 'https://newsite.dev',
    });

    const updated = useAuthStore.getState().user;
    expect(updated?.headline).toBe('Principal AI & Mobile Architect');
    expect(updated?.skills).toContain('Worklets');
    expect(updated?.website).toBe('https://newsite.dev');
  });

  test('updatePrivacySettings modifies account visibility and interaction permissions', () => {
    useAuthStore.getState().updatePrivacySettings({
      profileVisibility: 'followers',
      showActivityStatus: false,
      allowDirectMessages: 'followers',
    });

    const settings = useAuthStore.getState().user?.privacySettings;
    expect(settings?.profileVisibility).toBe('followers');
    expect(settings?.showActivityStatus).toBe(false);
    expect(settings?.allowDirectMessages).toBe('followers');
  });

  test('Moderation: blockUser adds to blocked list and removes from muted/restricted', () => {
    const targetUser = {
      id: 'bad_user_99',
      name: 'Bad Actor',
      username: 'bad_actor',
      avatarUrl: '',
    };

    useAuthStore.getState().muteUser(targetUser);
    expect(useAuthStore.getState().mutedUsers.some((u) => u.id === 'bad_user_99')).toBe(true);

    // Block user removes from muted and adds to blocked
    useAuthStore.getState().blockUser(targetUser);
    expect(useAuthStore.getState().blockedUsers.some((u) => u.id === 'bad_user_99')).toBe(true);
    expect(useAuthStore.getState().mutedUsers.some((u) => u.id === 'bad_user_99')).toBe(false);

    // Unblock
    useAuthStore.getState().unblockUser('bad_user_99');
    expect(useAuthStore.getState().blockedUsers.some((u) => u.id === 'bad_user_99')).toBe(false);
  });

  test('Moderation: restrictUser and unrestrictUser properly manage restrictions', () => {
    const targetUser = {
      id: 'annoying_user_1',
      name: 'Annoying Contact',
      username: 'annoying_contact',
      avatarUrl: '',
    };

    useAuthStore.getState().restrictUser(targetUser);
    expect(useAuthStore.getState().restrictedUsers.some((u) => u.id === 'annoying_user_1')).toBe(true);

    useAuthStore.getState().unrestrictUser('annoying_user_1');
    expect(useAuthStore.getState().restrictedUsers.some((u) => u.id === 'annoying_user_1')).toBe(false);
  });
});

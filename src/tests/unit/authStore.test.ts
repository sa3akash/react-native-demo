import { useAuthStore, UserSession } from '../../features/auth/store/authStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().setUnauthenticated();
  });

  const dummyUser: UserSession = {
    id: 'usr_123',
    email: 'architect@enterprise.io',
    fullName: 'Principal Architect',
    role: 'admin',
  };

  it('should initialize with unauthenticated state after reset', () => {
    const state = useAuthStore.getState();
    expect(state.status).toBe('unauthenticated');
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });

  it('should transition to authenticated state upon setting user and tokens', () => {
    useAuthStore.getState().setAuthenticated(dummyUser, 'access_jwt_123');

    const state = useAuthStore.getState();
    expect(state.status).toBe('authenticated');
    expect(state.user).toEqual(dummyUser);
    expect(state.accessToken).toBe('access_jwt_123');
  });

  it('should handle token rotation update', () => {
    useAuthStore.getState().setAuthenticated(dummyUser, 'old_access_token');
    useAuthStore.getState().updateTokens('new_rotated_access_token');

    const state = useAuthStore.getState();
    expect(state.status).toBe('authenticated');
    expect(state.accessToken).toBe('new_rotated_access_token');
  });

  it('should handle logout clean state transition', () => {
    useAuthStore.getState().setAuthenticated(dummyUser, 'access_jwt_123');
    useAuthStore.getState().setUnauthenticated();

    const state = useAuthStore.getState();
    expect(state.status).toBe('unauthenticated');
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });
});

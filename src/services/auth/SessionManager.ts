import { useAuthStore } from '../../features/auth/store/authStore';
import { tokenManager } from '../api/tokenManager';

export const SessionManager = {
  restoreSession: async (): Promise<boolean> => {
    try {
      const accessToken = await tokenManager.getAccessToken();
      const refreshToken = await tokenManager.getRefreshToken();

      if (!accessToken || !refreshToken) {
        useAuthStore.getState().setUnauthenticated();
        return false;
      }

      // Restoring active session credentials
      useAuthStore.getState().setAuthenticated(
        {
          id: 'usr_restored',
          email: 'user@example.com',
          fullName: 'Alex Vance',
          role: 'user',
        },
        accessToken,
      );
      return true;
    } catch (error) {
      console.error('Session restore failed', error);
      await tokenManager.clearTokens();
      useAuthStore.getState().setUnauthenticated();
      return false;
    }
  },

  logout: async (): Promise<void> => {
    await tokenManager.clearTokens();
    useAuthStore.getState().setUnauthenticated();
  },
};

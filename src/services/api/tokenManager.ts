import { SECURE_KEYS } from '../../constants';
import { secureStorage } from '../storage/secureStorage';

export const tokenManager = {
  getAccessToken: async (): Promise<string | null> => {
    return secureStorage.getItem(SECURE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken: async (): Promise<string | null> => {
    return secureStorage.getItem(SECURE_KEYS.REFRESH_TOKEN);
  },

  setTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
    await Promise.all([
      secureStorage.setItem(SECURE_KEYS.ACCESS_TOKEN, accessToken),
      secureStorage.setItem(SECURE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  },

  clearTokens: async (): Promise<void> => {
    await Promise.all([
      secureStorage.removeItem(SECURE_KEYS.ACCESS_TOKEN),
      secureStorage.removeItem(SECURE_KEYS.REFRESH_TOKEN),
    ]);
  },
};

import * as Keychain from 'react-native-keychain';

export const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch {
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<boolean> => {
    try {
      await Keychain.setGenericPassword(key, value, { service: key });
      return true;
    } catch (error) {
      console.error(`SecureStorage setItem failed for key ${key}`, error);
      return false;
    }
  },

  removeItem: async (key: string): Promise<boolean> => {
    try {
      await Keychain.resetGenericPassword({ service: key });
      return true;
    } catch (error) {
      console.error(`SecureStorage removeItem failed for key ${key}`, error);
      return false;
    }
  },
};

import { MMKV } from 'react-native-mmkv';

const mmkvInstance = new MMKV({
  id: 'app-default-storage',
});

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const raw = mmkvInstance.getString(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      mmkvInstance.set(key, serialized);
    } catch (error) {
      console.error(`Error writing key ${key} to MMKV storage`, error);
    }
  },

  remove: (key: string): void => {
    try {
      mmkvInstance.delete(key);
    } catch (error) {
      console.error(`Error deleting key ${key} from MMKV storage`, error);
    }
  },

  clear: (): void => {
    try {
      mmkvInstance.clearAll();
    } catch (error) {
      console.error('Error clearing MMKV storage', error);
    }
  },
};

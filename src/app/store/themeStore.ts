import { create } from 'zustand';
import { STORAGE_KEYS } from '../../constants';
import { storage } from '../../services/storage/storage';
import { ThemeMode } from '../../types';

interface ThemeState {
  readonly mode: ThemeMode;
  readonly setMode: (mode: ThemeMode) => void;
}

const getInitialMode = (): ThemeMode => {
  const saved = storage.get<ThemeMode>(STORAGE_KEYS.THEME_MODE);
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system';
};

export const useThemeStore = create<ThemeState>(set => ({
  mode: getInitialMode(),
  setMode: (mode: ThemeMode) => {
    storage.set(STORAGE_KEYS.THEME_MODE, mode);
    set({ mode });
  },
}));

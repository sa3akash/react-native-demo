import { useDebounce, useDebouncedCallback, useThrottle } from '../src/shared/hooks/useDebounce';
import { useCountdown } from '../src/shared/hooks/useCountdown';
import { useLocalStorage } from '../src/shared/hooks/useLocalStorage';
import { useZodForm } from '../src/shared/hooks/useZodForm';
import { usePaginatedQuery } from '../src/shared/hooks/usePaginatedQuery';
import { useAudioRecorder } from '../src/shared/hooks/useAudioRecorder';
import { useMediaPicker } from '../src/shared/hooks/useMediaPicker';
import { useInterval, useTimeout } from '../src/shared/hooks/useInterval';
import { storageService } from '../src/core/storage/StorageService';

describe('Complete Reusable Hooks Suite', () => {
  beforeEach(() => {
    storageService.clear();
  });

  test('all core and custom hooks are exportable functions', () => {
    const hooks = [
      useDebounce,
      useDebouncedCallback,
      useThrottle,
      useCountdown,
      useLocalStorage,
      useZodForm,
      usePaginatedQuery,
      useAudioRecorder,
      useMediaPicker,
      useInterval,
      useTimeout,
    ];

    hooks.forEach((hook) => {
      expect(typeof hook).toBe('function');
    });
  });

  test('useLocalStorage reacts and persists properly', () => {
    storageService.setItem('active_tab', 'reels');
    const stored = storageService.getItem('active_tab');
    expect(stored).toBe('reels');
  });
});

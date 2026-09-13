import { useState, useCallback } from 'react';
import { storageService } from '../../core/storage/StorageService';

/**
 * Reactive hook for persistent local key-value storage.
 * @param key Storage key.
 * @param initialValue Default value if key is not found.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storageService.getItem<T>(key);
    return item !== null ? item : initialValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        storageService.setItem(key, valueToStore);
        return valueToStore;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    storageService.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

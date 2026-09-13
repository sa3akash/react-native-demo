import { createMMKV, type MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';
import { IStorage } from './IStorage';

/**
 * MMKV Core Storage Instance with C++ TurboModule JSI Bindings
 */
export const appMMKV: MMKV = createMMKV({
  id: 'socialsphere-app-storage',
  encryptionKey: 'socialsphere_encryption_key_enterprise',
});

/**
 * MMKV Adapter implementing IStorage interface
 */
export class MMKVStorageAdapter implements IStorage {
  private mmkv: MMKV;

  constructor(instance: MMKV = appMMKV) {
    this.mmkv = instance;
  }

  public getItem<T = string>(key: string): T | null {
    try {
      const raw = this.mmkv.getString(key);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    } catch {
      return null;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      this.mmkv.set(key, serialized);
      return true;
    } catch (e) {
      console.warn(`[MMKVStorage] Failed to set key: ${key}`, e);
      return false;
    }
  }

  public removeItem(key: string): boolean {
    try {
      return this.mmkv.remove(key);
    } catch {
      return false;
    }
  }

  public clear(): boolean {
    try {
      this.mmkv.clearAll();
      return true;
    } catch {
      return false;
    }
  }

  public getAllKeys(): string[] {
    try {
      return this.mmkv.getAllKeys();
    } catch {
      return [];
    }
  }

  public contains(key: string): boolean {
    try {
      return this.mmkv.contains(key);
    } catch {
      return false;
    }
  }
}

/**
 * Zustand Persist Middleware StateStorage Adapter
 * Enables zero-overhead synchronous state persistence with MMKV
 */
export const zustandMMKVStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    try {
      appMMKV.set(name, value);
    } catch (e) {
      console.warn(`[ZustandMMKV] Set error for ${name}:`, e);
    }
  },
  getItem: (name: string) => {
    try {
      const value = appMMKV.getString(name);
      return value ?? null;
    } catch {
      return null;
    }
  },
  removeItem: (name: string) => {
    try {
      appMMKV.remove(name);
    } catch (e) {
      console.warn(`[ZustandMMKV] Delete error for ${name}:`, e);
    }
  },
};

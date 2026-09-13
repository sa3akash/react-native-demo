/**
 * High-performance Key-Value Storage Adapter with MMKV integration & in-memory fallback
 */

class StorageAdapter {
  private inMemoryStore: Map<string, string> = new Map();
  private mmkvInstance: {
    getString: (key: string) => string | undefined;
    set: (key: string, value: string) => void;
    delete: (key: string) => void;
    clearAll: () => void;
  } | null = null;

  constructor() {
    try {
      // Safely check if MMKV is available
      const { MMKV } = require("react-native-mmkv");
      this.mmkvInstance = new MMKV();
    } catch {
      // Fallback to in-memory store for test environment or non-native builds
      this.mmkvInstance = null;
    }
  }

  public getString(key: string): string | null {
    if (this.mmkvInstance) {
      return this.mmkvInstance.getString(key) ?? null;
    }
    return this.inMemoryStore.get(key) ?? null;
  }

  public setString(key: string, value: string): void {
    if (this.mmkvInstance) {
      this.mmkvInstance.set(key, value);
    } else {
      this.inMemoryStore.set(key, value);
    }
  }

  public getObject<T>(key: string): T | null {
    const raw = this.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  public setObject<T>(key: string, value: T): void {
    this.setString(key, JSON.stringify(value));
  }

  public removeItem(key: string): void {
    if (this.mmkvInstance) {
      this.mmkvInstance.delete(key);
    } else {
      this.inMemoryStore.delete(key);
    }
  }

  public clearAll(): void {
    if (this.mmkvInstance) {
      this.mmkvInstance.clearAll();
    } else {
      this.inMemoryStore.clear();
    }
  }
}

export const storageAdapter = new StorageAdapter();

import { IStorage } from './IStorage';
import { MMKVStorageAdapter } from './MMKVStorage';

class MemoryStorageAdapter implements IStorage {
  private store: Map<string, string> = new Map();

  public getItem<T = string>(key: string): T | null {
    const raw = this.store.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      this.store.set(key, serialized);
      return true;
    } catch (e) {
      console.warn(`[MemoryStorage] Failed to set key: ${key}`, e);
      return false;
    }
  }

  public removeItem(key: string): boolean {
    return this.store.delete(key);
  }

  public clear(): boolean {
    this.store.clear();
    return true;
  }

  public getAllKeys(): string[] {
    return Array.from(this.store.keys());
  }

  public contains(key: string): boolean {
    return this.store.has(key);
  }
}

class HybridStorageService implements IStorage {
  private adapter: IStorage;
  private readonly prefix: string;

  constructor(prefix = 'social_app:') {
    this.prefix = prefix;
    try {
      // Direct MMKV high-performance C++ JSI storage
      this.adapter = new MMKVStorageAdapter();
    } catch {
      // Memory fallback for headless unit tests and legacy runtimes
      this.adapter = new MemoryStorageAdapter();
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  public getItem<T = string>(key: string): T | null {
    return this.adapter.getItem<T>(this.getKey(key));
  }

  public setItem<T>(key: string, value: T): boolean {
    return this.adapter.setItem(this.getKey(key), value);
  }

  public removeItem(key: string): boolean {
    return this.adapter.removeItem(this.getKey(key));
  }

  public clear(): boolean {
    return this.adapter.clear();
  }

  public getAllKeys(): string[] {
    return this.adapter.getAllKeys().map((k) => k.replace(this.prefix, ''));
  }

  public contains(key: string): boolean {
    return this.adapter.contains(this.getKey(key));
  }
}

export const storageService: IStorage = new HybridStorageService();
export const secureStorageService: IStorage = new HybridStorageService('social_secure:');
export * from './MMKVStorage';

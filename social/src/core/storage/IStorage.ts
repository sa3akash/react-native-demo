export interface IStorage {
  getItem<T = string>(key: string): T | null;
  setItem<T>(key: string, value: T): boolean;
  removeItem(key: string): boolean;
  clear(): boolean;
  getAllKeys(): string[];
  contains(key: string): boolean;
}

export interface IAsyncStorage {
  getItem<T = string>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<boolean>;
  removeItem(key: string): Promise<boolean>;
  clear(): Promise<boolean>;
}

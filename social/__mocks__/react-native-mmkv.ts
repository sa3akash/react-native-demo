const memoryStorage = new Map<string, string>();

export const createMMKV = jest.fn(() => ({
  id: 'mock-mmkv',
  getString: jest.fn((key: string) => memoryStorage.get(key)),
  set: jest.fn((key: string, value: any) => {
    memoryStorage.set(key, String(value));
  }),
  remove: jest.fn((key: string) => {
    memoryStorage.delete(key);
    return true;
  }),
  contains: jest.fn((key: string) => memoryStorage.has(key)),
  clearAll: jest.fn(() => {
    memoryStorage.clear();
  }),
  getAllKeys: jest.fn(() => Array.from(memoryStorage.keys())),
}));

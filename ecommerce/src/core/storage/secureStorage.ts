/**
 * Secure Credentials Storage Adapter (React Native Keychain + Fallback)
 * Never store tokens or sensitive credentials in unencrypted storage!
 */

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

class SecureStorageAdapter {
  private inMemorySecureStore: Map<string, string> = new Map();
  private keychain: {
    setGenericPassword: (username: string, password: string, service?: { service: string }) => Promise<unknown>;
    getGenericPassword: (service?: { service: string }) => Promise<false | { username: string; password: string }>;
    resetGenericPassword: (service?: { service: string }) => Promise<boolean>;
  } | null = null;

  constructor() {
    try {
      this.keychain = require("react-native-keychain");
    } catch {
      this.keychain = null;
    }
  }

  public async saveAuthTokens(tokens: AuthTokens): Promise<void> {
    const payload = JSON.stringify(tokens);
    if (this.keychain) {
      try {
        await this.keychain.setGenericPassword("auth_tokens", payload, {
          service: "com.ecommerce.auth",
        });
        return;
      } catch {
        // Fall back to memory on keychain error
      }
    }
    this.inMemorySecureStore.set("auth_tokens", payload);
  }

  public async getAuthTokens(): Promise<AuthTokens | null> {
    if (this.keychain) {
      try {
        const credentials = await this.keychain.getGenericPassword({
          service: "com.ecommerce.auth",
        });
        if (credentials && credentials.password) {
          return JSON.parse(credentials.password) as AuthTokens;
        }
      } catch {
        // Fall back to memory
      }
    }
    const raw = this.inMemorySecureStore.get("auth_tokens");
    if (raw) {
      try {
        return JSON.parse(raw) as AuthTokens;
      } catch {
        return null;
      }
    }
    return null;
  }

  public async clearAuthTokens(): Promise<void> {
    if (this.keychain) {
      try {
        await this.keychain.resetGenericPassword({
          service: "com.ecommerce.auth",
        });
      } catch {
        // Fall through
      }
    }
    this.inMemorySecureStore.delete("auth_tokens");
  }
}

export const secureStorage = new SecureStorageAdapter();

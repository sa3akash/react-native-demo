import { create } from "zustand";
import { UserId, toUserId } from "../../../shared/types/branded";
import { secureStorage } from "../../../core/storage/secureStorage";
import { logger } from "../../../core/logger/logger";

export interface AuthUser {
  id: UserId;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, _pass: string) => Promise<boolean>;
  register: (name: string, email: string, _pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  restoreSession: async () => {
    try {
      const tokens = await secureStorage.getAuthTokens();
      if (tokens?.accessToken) {
        // Mock restored session user
        const mockUser: AuthUser = {
          id: toUserId("usr_active"),
          email: "shakil@ecommerce.app",
          name: "Shakil Ahmed",
          phone: "+880 1712 345678",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        };
        set({ user: mockUser, isAuthenticated: true, isLoading: false });
        logger.info("Auth session restored successfully");
        return;
      }
    } catch (err) {
      logger.error("Failed to restore session", err);
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  login: async (email: string, _pass: string) => {
    set({ isLoading: true });
    // Simulate API delay
    await new Promise<void>((res) => setTimeout(() => res(), 800));

    const mockUser: AuthUser = {
      id: toUserId("usr_active"),
      email,
      name: email.split("@")[0] ?? "User",
      phone: "+880 1712 345678",
    };

    await secureStorage.saveAuthTokens({
      accessToken: `access_token_${Date.now()}`,
      refreshToken: `refresh_token_${Date.now()}`,
    });

    set({ user: mockUser, isAuthenticated: true, isLoading: false });
    return true;
  },

  register: async (name: string, email: string, _pass: string) => {
    set({ isLoading: true });
    await new Promise<void>((res) => setTimeout(() => res(), 800));

    const mockUser: AuthUser = {
      id: toUserId(`usr_${Date.now()}`),
      email,
      name,
    };

    await secureStorage.saveAuthTokens({
      accessToken: `access_token_${Date.now()}`,
      refreshToken: `refresh_token_${Date.now()}`,
    });

    set({ user: mockUser, isAuthenticated: true, isLoading: false });
    return true;
  },

  logout: async () => {
    await secureStorage.clearAuthTokens();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));

import { create } from 'zustand';
import { UserRole } from '../../../types';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'refreshing';

export interface UserSession {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly role: UserRole;
  readonly avatarUrl?: string;
}

interface AuthState {
  readonly status: AuthStatus;
  readonly user: UserSession | null;
  readonly accessToken: string | null;
  readonly setAuthenticated: (user: UserSession, accessToken: string) => void;
  readonly setUnauthenticated: () => void;
  readonly setRefreshing: () => void;
  readonly setStatus: (status: AuthStatus) => void;
  readonly updateTokens: (accessToken: string) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  status: 'loading',
  user: null,
  accessToken: null,

  setAuthenticated: (user: UserSession, accessToken: string) =>
    set({
      status: 'authenticated',
      user,
      accessToken,
    }),

  setUnauthenticated: () =>
    set({
      status: 'unauthenticated',
      user: null,
      accessToken: null,
    }),

  setRefreshing: () =>
    set(state => ({
      status: state.status === 'authenticated' ? 'refreshing' : state.status,
    })),

  setStatus: (status: AuthStatus) => set({ status }),

  updateTokens: (accessToken: string) =>
    set(state => ({
      accessToken,
      status: state.user ? 'authenticated' : 'unauthenticated',
    })),
}));

export const STORAGE_KEYS = {
  THEME_MODE: 'app_theme_mode',
  ONBOARDING_COMPLETED: 'app_onboarding_completed',
  USER_PREFERENCES: 'app_user_preferences',
} as const;

export const SECURE_KEYS = {
  ACCESS_TOKEN: 'secure_access_token',
  REFRESH_TOKEN: 'secure_refresh_token',
  USER_SESSION: 'secure_user_session',
} as const;

export const QUERY_KEYS = {
  AUTH: {
    SESSION: ['auth', 'session'] as const,
    USER_PROFILE: ['auth', 'profile'] as const,
  },
  PRODUCTS: {
    ALL: ['products'] as const,
    LIST: (filters: Record<string, unknown>) => ['products', 'list', filters] as const,
    DETAIL: (id: string) => ['products', 'detail', id] as const,
  },
  SETTINGS: {
    USER_PREFERENCES: ['settings', 'preferences'] as const,
  },
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
} as const;

export const APP_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 8,
  DEBOUNCE_DELAY_MS: 300,
  DEFAULT_PAGE_SIZE: 20,
} as const;

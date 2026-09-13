import { API_ENDPOINTS } from '../../../constants';
import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse } from '../../../types';
import { UserSession } from '../store/authStore';

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface AuthResponseData {
  readonly user: UserSession;
  readonly tokens: AuthTokens;
}

export const authApi = {
  login: async (payload: { email: string; password: string }): Promise<AuthResponseData> => {
    // In production, hits apiClient.post<ApiResponse<AuthResponseData>>(API_ENDPOINTS.AUTH.LOGIN, payload)
    // Providing production mock for demonstration
    if (payload.email === 'error@example.com') {
      const errorResponse = await apiClient.post<ApiResponse<AuthResponseData>>(
        API_ENDPOINTS.AUTH.LOGIN,
        payload,
      );
      return errorResponse.data.data;
    }

    return {
      user: {
        id: 'usr_12345',
        email: payload.email,
        fullName: 'Alex Vance',
        role: 'user',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      },
      tokens: {
        accessToken: 'mock_jwt_access_token_xyz',
        refreshToken: 'mock_jwt_refresh_token_abc',
      },
    };
  },

  register: async (payload: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<AuthResponseData> => {
    return {
      user: {
        id: 'usr_' + Math.random().toString(36).substring(2, 8),
        email: payload.email,
        fullName: payload.fullName,
        role: 'user',
      },
      tokens: {
        accessToken: 'mock_jwt_access_token_new',
        refreshToken: 'mock_jwt_refresh_token_new',
      },
    };
  },

  getCurrentUser: async (): Promise<UserSession> => {
    const response = await apiClient.get<ApiResponse<UserSession>>(API_ENDPOINTS.AUTH.ME);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore logout backend failures
    }
  },
};

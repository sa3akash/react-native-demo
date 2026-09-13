import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { config } from '../../app/config';
import { API_ENDPOINTS } from '../../constants';
import { useAuthStore } from '../../features/auth/store/authStore';
import { normalizeApiError } from './apiError';
import { tokenManager } from './tokenManager';

export const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: config.clientTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
apiClient.interceptors.request.use(
  async (requestConfig: InternalAxiosRequestConfig) => {
    const requestId = Math.random().toString(36).substring(2, 10);
    requestConfig.headers.set('X-Request-ID', requestId);

    const token = await tokenManager.getAccessToken();
    if (token) {
      requestConfig.headers.set('Authorization', `Bearer ${token}`);
    }

    if (config.enableLogging && config.isDevelopment) {
      console.log(
        `[HTTP Request ${requestId}] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`,
      );
    }

    return requestConfig;
  },
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);

// Response Interceptor
apiClient.interceptors.response.use(
  response => {
    if (config.enableLogging && config.isDevelopment) {
      console.log(`[HTTP Response ${response.status}] ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
        // Refresh token failed, clear state & force logout
        await tokenManager.clearTokens();
        useAuthStore.getState().setUnauthenticated();
        return Promise.reject(normalizeApiError(error));
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(newToken => {
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(normalizeApiError(err)));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = await tokenManager.getRefreshToken();
        if (!storedRefreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await axios.post<{
          data: { accessToken: string; refreshToken: string };
        }>(`${config.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`, { refreshToken: storedRefreshToken });

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
        await tokenManager.setTokens(accessToken, newRefreshToken);
        useAuthStore.getState().updateTokens(accessToken);

        processQueue(null, accessToken);
        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        await tokenManager.clearTokens();
        useAuthStore.getState().setUnauthenticated();
        return Promise.reject(normalizeApiError(refreshErr));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

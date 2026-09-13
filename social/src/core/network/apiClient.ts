import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG } from '../config/appConfig';
import { AppError, AuthError, NetworkError, ValidationError } from '../errors/AppError';
import { storageService } from '../storage/StorageService';
import { keychainService } from '../security/KeychainService';
import { eventBus } from '../events/EventBus';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: APP_CONFIG.apiBaseUrl,
      timeout: APP_CONFIG.timeoutMs,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-App-Version': APP_CONFIG.version,
      },
    });

    this.setupInterceptors();
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token!);
      }
    });
    this.failedQueue = [];
  }

  private setupInterceptors() {
    // Request Interceptor with Keychain Token Injection
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        let token = await keychainService.getAccessToken();
        if (!token) {
          token = storageService.getItem<string>('auth_token');
        }
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(new NetworkError('Failed to send request', error))
    );

    // Response Interceptor with Keychain Token Refresh Mutex
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!error.response) {
          return Promise.reject(new NetworkError('Network request failed or offline.'));
        }

        const { status, data } = error.response;

        // 401 Unauthorized - Refresh token handling
        if (status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.client(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            let refreshToken = await keychainService.getRefreshToken();
            if (!refreshToken) {
              refreshToken = storageService.getItem<string>('refresh_token');
            }

            if (!refreshToken) {
              throw new AuthError('No refresh token available');
            }

            // Call refresh endpoint simulation
            const refreshResponse = await axios.post(`${APP_CONFIG.apiBaseUrl}/auth/refresh`, {
              refreshToken,
            });

            const newToken = refreshResponse.data.data.token;
            const newRefreshToken = refreshResponse.data.data.refreshToken || refreshToken;

            await keychainService.setAuthTokens(newToken, newRefreshToken);
            storageService.setItem('auth_token', newToken);
            storageService.setItem('refresh_token', newRefreshToken);

            this.processQueue(null, newToken);
            this.isRefreshing = false;

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshErr) {
            this.processQueue(refreshErr, null);
            this.isRefreshing = false;
            await keychainService.clearAuthTokens();
            storageService.removeItem('auth_token');
            storageService.removeItem('refresh_token');
            eventBus.emit('AUTH:SESSION_EXPIRED', { timestamp: Date.now() });
            return Promise.reject(new AuthError('Session expired, please login again.'));
          }
        }

        if (status === 422) {
          return Promise.reject(new ValidationError(data?.message || 'Validation error', data?.errors));
        }

        return Promise.reject(
          new AppError(data?.message || 'Server error', 'SERVER_ERROR', status, data)
        );
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res = await this.client.get<ApiResponse<T>>(url, config);
    return res.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res = await this.client.post<ApiResponse<T>>(url, data, config);
    return res.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res = await this.client.put<ApiResponse<T>>(url, data, config);
    return res.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res = await this.client.delete<ApiResponse<T>>(url, config);
    return res.data;
  }
}

export const apiClient = new ApiClient();

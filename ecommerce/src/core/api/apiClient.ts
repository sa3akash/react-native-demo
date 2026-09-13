import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { secureStorage } from "../storage/secureStorage";
import { AppError } from "../errors/AppError";
import { logger } from "../logger/logger";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  requestId?: string;
}

const API_BASE_URL = "https://api.ecommerce.app/v1";

class ApiClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor: Attach Access Token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const tokens = await secureStorage.getAuthTokens();
        if (tokens?.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        logger.debug(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(AppError.fromApiError(error))
    );

    // Response Interceptor: Handle Token Refresh & Errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.axiosInstance(originalRequest);
              })
              .catch((err) => Promise.reject(AppError.fromApiError(err)));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const tokens = await secureStorage.getAuthTokens();
            if (!tokens?.refreshToken) {
              throw new AppError("Session expired", "UNAUTHORIZED");
            }

            // Call refresh endpoint
            const refreshResponse = await axios.post<{ accessToken: string; refreshToken: string }>(
              `${API_BASE_URL}/auth/refresh`,
              { refreshToken: tokens.refreshToken }
            );

            const newTokens = refreshResponse.data;
            await secureStorage.saveAuthTokens(newTokens);

            this.processQueue(null, newTokens.accessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            }

            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            await secureStorage.clearAuthTokens();
            return Promise.reject(AppError.fromApiError(refreshError));
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(AppError.fromApiError(error));
      }
    );
  }

  private processQueue(error: unknown, token: string | null = null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else if (token) {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();

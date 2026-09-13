import { ApiError } from '../../types';

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: readonly Record<string, string>[];

  constructor(
    message: string,
    code = 'APP_ERROR',
    statusCode = 500,
    details?: readonly Record<string, string>[],
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    if (details !== undefined) {
      this.details = details;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network connection unavailable or request timed out') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication required or session expired', statusCode = 401) {
    super(message, 'AUTH_ERROR', statusCode);
    this.name = 'AuthError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'Validation failed for request payload',
    details?: readonly Record<string, string>[],
  ) {
    super(message, 'VALIDATION_ERROR', 422, details);
    this.name = 'ValidationError';
  }
}

export class ServerError extends AppError {
  constructor(message = 'An unexpected server error occurred', statusCode = 500) {
    super(message, 'SERVER_ERROR', statusCode);
    this.name = 'ServerError';
  }
}

export const normalizeApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const errObj = error as { response?: { status?: number; data?: ApiError }; message?: string };

    if (errObj.response) {
      const status = errObj.response.status ?? 500;
      const apiErrData = errObj.response.data;

      if (status === 401 || status === 403) {
        return new AuthError(apiErrData?.message || 'Unauthorized access', status);
      }
      if (status === 422) {
        return new ValidationError(
          apiErrData?.message || 'Invalid input params',
          apiErrData?.details,
        );
      }
      return new ServerError(apiErrData?.message || `Request failed with status ${status}`, status);
    }

    if (errObj.message && errObj.message.includes('Network Error')) {
      return new NetworkError();
    }
  }

  return new AppError('An unexpected error occurred. Please try again.', 'UNKNOWN_ERROR', 500);
};

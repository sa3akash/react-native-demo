export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'UNAUTHORIZED'
  | 'TOKEN_EXPIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'MODERATION_BLOCKED'
  | 'BIOMETRIC_FAILED'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'OFFLINE'
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode?: number;
  public readonly details?: Record<string, unknown>;
  public readonly isOperational: boolean;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: ErrorCode = 'UNKNOWN_ERROR',
    statusCode?: number,
    details?: Record<string, unknown>,
    isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network connection failed. Please check your internet.', details?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', 0, details);
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication failed. Please log in again.', code: ErrorCode = 'UNAUTHORIZED', statusCode = 401) {
    super(message, code, statusCode);
  }
}

export class ValidationError extends AppError {
  public readonly fieldErrors?: Record<string, string[]>;
  constructor(message = 'Validation error occurred.', fieldErrors?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 422, { fieldErrors });
    this.fieldErrors = fieldErrors;
  }
}

export class ModerationError extends AppError {
  constructor(message = 'Content violates community guidelines.', details?: Record<string, unknown>) {
    super(message, 'MODERATION_BLOCKED', 400, details);
  }
}

export class BiometricError extends AppError {
  constructor(message = 'Biometric authentication was cancelled or failed.') {
    super(message, 'BIOMETRIC_FAILED', 403);
  }
}

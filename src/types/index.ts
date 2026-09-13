/**
 * Shared Type Primitives for Enterprise Application Architecture
 */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Result<T, E = Error> =
  { readonly success: true; readonly data: T } | { readonly success: false; readonly error: E };

export interface ApiResponse<T> {
  readonly data: T;
  readonly message: string;
  readonly statusCode: number;
  readonly timestamp: string;
  readonly requestId?: string;
}

export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
}

export interface ApiError {
  readonly message: string;
  readonly code: string;
  readonly statusCode: number;
  readonly details?: readonly Record<string, string>[];
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type UserRole = 'guest' | 'user' | 'moderator' | 'admin' | 'superadmin';

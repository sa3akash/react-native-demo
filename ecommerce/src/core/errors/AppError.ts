export type AppErrorCode =
  | "NETWORK_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "TIMEOUT"
  | "OFFLINE"
  | "UNKNOWN";

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode?: number;
  public readonly originalError?: unknown;

  constructor(message: string, code: AppErrorCode = "UNKNOWN", statusCode?: number, originalError?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    if (statusCode !== undefined) {
      this.statusCode = statusCode;
    }
    if (originalError !== undefined) {
      this.originalError = originalError;
    }

    // Maintain proper stack trace in V8 engines
    if (typeof (Error as any).captureStackTrace === "function") {
      (Error as any).captureStackTrace(this, AppError);
    }
  }

  public static fromApiError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (typeof error === "object" && error !== null && "isAxiosError" in error) {
      const axiosErr = error as {
        response?: { status: number; data?: { message?: string } };
        message?: string;
        code?: string;
      };

      const status = axiosErr.response?.status;
      const message = axiosErr.response?.data?.message || axiosErr.message || "An unexpected network error occurred";

      if (status === 401) {
        return new AppError(message, "UNAUTHORIZED", status, error);
      }
      if (status === 403) {
        return new AppError(message, "FORBIDDEN", status, error);
      }
      if (status === 404) {
        return new AppError(message, "NOT_FOUND", status, error);
      }
      if (status === 422) {
        return new AppError(message, "VALIDATION_ERROR", status, error);
      }
      if (status && status >= 500) {
        return new AppError(message, "SERVER_ERROR", status, error);
      }
      if (axiosErr.code === "ECONNABORTED") {
        return new AppError("Request timed out", "TIMEOUT", undefined, error);
      }
      return new AppError(message, "NETWORK_ERROR", status, error);
    }

    if (error instanceof Error) {
      return new AppError(error.message, "UNKNOWN", undefined, error);
    }

    return new AppError("An unknown error occurred", "UNKNOWN", undefined, error);
  }
}

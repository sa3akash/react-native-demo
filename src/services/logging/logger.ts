import { config } from '../../app/config';

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>): void => {
    if (config.enableLogging && config.isDevelopment) {
      console.log(`[DEBUG] ${message}`, meta || '');
    }
  },

  info: (message: string, meta?: Record<string, unknown>): void => {
    if (config.enableLogging) {
      console.info(`[INFO] ${message}`, meta || '');
    }
  },

  warn: (message: string, meta?: Record<string, unknown>): void => {
    console.warn(`[WARN] ${message}`, meta || '');
  },

  error: (message: string, error?: unknown, meta?: Record<string, unknown>): void => {
    console.error(`[ERROR] ${message}`, error || '', meta || '');
  },
};

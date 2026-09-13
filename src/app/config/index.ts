export interface AppConfig {
  readonly apiUrl: string;
  readonly environment: 'development' | 'staging' | 'production';
  readonly isProduction: boolean;
  readonly isDevelopment: boolean;
  readonly enableLogging: boolean;
  readonly clientTimeout: number;
}

const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const env = process.env.ENVIRONMENT;
  if (env === 'production' || env === 'staging') {
    return env;
  }
  return 'development';
};

export const config: AppConfig = Object.freeze({
  apiUrl: process.env.API_URL || 'https://api.example.com/v1',
  environment: getEnvironment(),
  isProduction: getEnvironment() === 'production',
  isDevelopment: getEnvironment() === 'development',
  enableLogging: process.env.ENABLE_LOGGING !== 'false',
  clientTimeout: Number(process.env.CLIENT_TIMEOUT) || 10000,
});

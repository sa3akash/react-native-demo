# Environment Configuration Guide

## Environment Variables

Environment variables are defined per environment and validated at app startup via `src/app/config/index.ts` using `zod`.

### Available Environments

1. `.env.development` (Development configuration)
2. `.env.staging` (Staging configuration)
3. `.env.production` (Production configuration)

### Schema Specification

```ts
export interface AppConfig {
  readonly environment: 'development' | 'staging' | 'production';
  readonly apiUrl: string;
  readonly apiTimeout: number;
  readonly enableLogging: boolean;
}
```

### Startup Validation
If any required environment variable is missing or invalid, the app throws an initialization error during startup, preventing runtime configuration crashes.

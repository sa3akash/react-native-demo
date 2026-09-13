# Environment Configuration

## Environment Variables (.env)
The application reads environment parameters during build and runtime configuration:

```env
API_BASE_URL=https://api.ecommerce.app/v1
ENVIRONMENT=development
ANALYTICS_KEY=prod_analytics_key_12345
PAYMENT_PUBLIC_KEY=pk_live_51M0...
SENTRY_DSN=https://sentry.io/12345
```

## Security Rule
Never commit raw `.env` files containing secrets or private tokens to source control.

# API Architecture & Contracts

## Endpoints Summary

### Authentication (`/auth`)
- `POST /auth/login`: User login with email/password.
- `POST /auth/register`: User registration.
- `POST /auth/refresh`: Refresh JWT access token.

### Products (`/products`)
- `GET /products`: List products with search/category/filter query options.
- `GET /products/:id`: Detailed product breakdown with variant matrix.

### Cart & Orders (`/cart`, `/orders`)
- `GET /cart`: Fetch synced user cart.
- `POST /orders`: Checkout and place new order.
- `GET /orders/:id`: Order details & live delivery tracking timeline.

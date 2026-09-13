# Architecture Documentation

## Overview
This e-commerce application is engineered using **Clean Architecture** and **Domain-Driven Design (DDD)** principles in React Native CLI with TypeScript.

## Core Layers

### 1. App (`src/app`)
Responsible for application initialization, root navigation, and provider composition.
- `navigation`: Typed stack and tab parameter lists.
- `providers`: QueryClientProvider, ThemeProvider, SafeAreaProvider, GestureHandler.

### 2. Domain (`src/domain`)
Encapsulates pure business logic with zero framework or external API dependencies.
- `pricing`: Minor-unit currency math (`Money`).
- `cart`: Tax, shipping, subtotal calculation models.
- `products`: Dynamic product variant resolution matrix.

### 3. Core Infrastructure (`src/core`)
Provides platform adapters, network infrastructure, storage mechanisms, and security primitives.
- `api`: Centralized Axios `ApiClient` with automated JWT refresh & request queueing.
- `storage`: High-performance local storage (MMKV) and secure encrypted credential storage (Keychain adapter).
- `networking`: Network connection state monitoring (`NetworkMonitor`) and offline write mutation queueing (`OfflineQueue`).
- `logger`: Redacted structured logging system preventing PII leaks.

### 4. Design System (`src/design-system`)
Tokenized design system supporting system dark mode and accessible reusable primitives.
- `colors`, `typography`, `spacing`, `radius`, `shadows`, `theme`.
- `components`: `Button`, `Card`, `Header`, `Price`, `Rating`, `QuantitySelector`, `DiscountBadge`, `Skeleton`, `EmptyState`, `ErrorState`.

### 5. Features (`src/features`)
Self-contained domain feature modules:
- `auth`, `home`, `products`, `categories`, `search`, `cart`, `checkout`, `orders`, `profile`, `reviews`.

## Unidirectional Data Flow Strategy
1. **Server State**: Managed via TanStack Query (v5) with automated caching and background revalidation.
2. **Client UI & Cart State**: Managed via Zustand (v5) utilizing granular selector subscriptions.

# Enterprise React Native CLI Architecture

A production-grade, highly scalable **React Native CLI** enterprise application architecture built from scratch using **TypeScript** and **Bun**. Designed to scale seamlessly from starter projects into large-scale enterprise applications.

---

## 🛠 Core Technology Stack

- **Framework**: React Native CLI 0.74.5 & React 18.2.0
- **Package Manager & Runtime**: Bun 1.3.x
- **Language**: TypeScript (Strict Mode with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `useUnknownInCatchVariables`)
- **Navigation**: React Navigation v6 (Type-safe Stack, Bottom Tabs, Modals & Deep Linking)
- **Server State & Caching**: TanStack Query v5 (React Query)
- **Client App State**: Zustand v4
- **Form Architecture**: React Hook Form + Zod
- **Fast Storage**: `react-native-mmkv` (Synchronous JSI bindings)
- **Secure Credentials**: `react-native-keychain` (Hardware-backed iOS Keychain / Android Keystore)
- **Animations & UI**: Reanimated 3 & Gesture Handler
- **List Performance**: `@shopify/flash-list`
- **Testing & Quality**: Jest, React Native Testing Library, ESLint, Prettier

---

## 📂 Architecture Overview

```text
src/
├── app/                  # Configuration, providers, startup lifecycle & app-wide stores
├── assets/               # Standardized images, fonts, icons, animations
├── components/           # Atomic Design System components (buttons, layout, forms, feedback, typography)
├── constants/            # Immutable application constants, regex, route names, limits
├── features/             # Feature-oriented domain modules (auth, home, profile, settings)
│   ├── auth/             # Login, Register, Forgot Password screens, hooks, store, schema & API
│   ├── home/             # Product catalogue & dynamic feeds
│   ├── profile/          # User profile settings & details
│   └── settings/         # Theme toggles & security preferences
├── hooks/                # App-wide utility hooks (useResponsive, useDebounce)
├── lib/                  # Library wrappers (queryClient)
├── navigation/           # RootNavigator, AuthNavigator, AppNavigator, TabNavigator & typed linking
├── services/             # Infrastructure services (Axios client, TokenManager, SessionManager, MMKV, Keychain)
├── theme/                # Design tokens (colors, typography, spacing, radius, shadows, dimensions)
├── types/                # Shared generic primitives (Result, ApiResponse, ApiError, PaginatedResponse)
├── utils/                # Domain-agnostic formatting & conversion utilities
└── tests/                # Testing utilities, custom renderers, unit & component test specs
```

---

## 🚀 Quick Start (Using Bun)

### 1. Prerequisites
- **Node.js** >= 18
- **Bun** >= 1.3.0
- **React Native Development Environment** (Android Studio / Xcode)

### 2. Installation
```bash
bun install
```

### 3. Running Scripts
```bash
# Typecheck TypeScript strictly
bun run typecheck

# Lint codebase with ESLint
bun run lint

# Format codebase with Prettier
bun run format

# Run Jest unit test suite
bun run test

# Launch Android dev server
bun run android

# Launch iOS dev server
bun run ios
```

---

## 🔒 Security Architecture

1. **Token Rotation & Queue**: Axios request/response interceptors automatically intercept `401 Unauthorized` responses, queue pending requests, and execute token rotation via `SessionManager`.
2. **Encrypted Storage**: Sensitive authentication keys (`accessToken` and `refreshToken`) are stored inside iOS Keychain / Android Keystore using `react-native-keychain`.
3. **MMKV Isolation**: Non-sensitive persistent user preferences (e.g., theme mode) are stored in ultra-fast `MMKV` storage without exposing credentials.

# Application Architecture Specifications

## 1. Feature-Oriented Modular Design

The codebase strictly enforces **Domain Feature Isolation**. Each feature module (e.g. `src/features/auth`) encapsulates its own:
- `api/`: Raw Axios feature requests & endpoints
- `components/`: UI components exclusive to the feature
- `hooks/`: Feature-specific custom hooks (`useLogin`, `useSession`)
- `schemas/`: Zod validation schemas
- `screens/`: React screen components
- `store/`: Local Zustand stores
- `types/`: Feature TypeScript interfaces

Cross-feature imports must happen via public interfaces or shared design system components.

---

## 2. State Boundaries & Responsibility Spectrum

| State Layer | Responsible Library | Storage Mechanism | Example Usage |
| :--- | :--- | :--- | :--- |
| **Server State** | TanStack Query v5 | In-Memory QueryCache | Products, User Profile, Fetch Requests |
| **Client App State** | Zustand v4 | Memory / Optional MMKV | Theme Mode, Toast Alerts, UI State |
| **Form State** | React Hook Form | React Component Ref | Form Inputs, Validation Messages |
| **Sensitive State** | SessionManager | Keychain / Keystore | Access & Refresh JWT Tokens |
| **Local Preferences** | storage service | MMKV Key-Value | Theme mode preference, Onboarding state |

---

## 3. Navigation State Machine

Navigation flow is driven by `authStore` status transitions:

```text
               Splash / Session Restore
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
   [Unauthenticated]             [Authenticated]
     AuthNavigator                AppNavigator
    ├── LoginScreen              ├── TabNavigator (Home, Profile, Settings)
    ├── RegisterScreen           └── ProductDetailScreen (Stack)
    └── ForgotPasswordScreen
```

Strict navigation param types are defined in `src/navigation/types.ts` to prevent invalid navigation routes at compile time.

# Testing Strategy

## Running Tests

### 1. TypeScript Verification
```bash
cmd /c node node_modules/typescript/bin/tsc --noEmit
```

### 2. Jest Unit & Integration Tests
```bash
cmd /c npm test
```

## Test Structure
- `__tests__/domain`: Unit tests for financial calculations (`money.test.ts`) and cart calculations (`cart.test.ts`).
- `__tests__/validators`: Zod schema validation tests (`validators.test.ts`).
- `__tests__/App.test.tsx`: Root render tests.

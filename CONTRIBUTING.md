# Contributing & Code Standards Guide

## Git Commit Conventions

Commits must follow Conventional Commits standard:

- `feat:` New feature addition
- `fix:` Bug fix
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Code change that improves performance
- `test:` Adding or updating tests
- `docs:` Documentation changes
- `chore:` Maintenance tasks or package updates

## Quality Check Pipeline

Before submitting a pull request, execute:

```bash
# 1. Typecheck
bun run typecheck

# 2. Linting & Formatting Check
bun run lint
bun run format:check

# 3. Unit & Integration Tests
bun run test
```

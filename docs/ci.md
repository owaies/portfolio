# CI Quality Gate

The `Portfolio Quality` workflow runs for pushes and pull requests targeting `main`.

Checks are intentionally simple and reproducible:

1. Checkout the repository.
2. Use Node.js 22 with npm caching.
3. Install dependencies.
4. Run `npm run typecheck`.
5. Run `npm run lint`.
6. Run `npm run build`.

A change should not be considered verified until the relevant GitHub Actions run completes successfully.

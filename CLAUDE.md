# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@pengzhanbo/utils` is a zero-dependency JavaScript/TypeScript utility library published to both JSR and npm. It provides common utility functions across multiple domains.

## Commands

```sh
pnpm build        # Build with tsdown (ESM output to dist/)
pnpm lint         # Lint with oxlint (type-check + type-aware)
pnpm format       # Format with oxfmt
pnpm test         # Run vitest (coverage always enabled in vitest.config.ts)
pnpm test -- src/array/uniq.test.ts  # Run a single test file
pnpm test:bench   # Run performance benchmarks (Vitest built-in bench API)
pnpm test:bench:json  # Export benchmark results as JSON
pnpm release      # bumpp + commit + push + tag (interactive)
pnpm release:publish  # Publish to npm/JSR
pnpm docs:dev     # Generate docs with TypeDoc in watch mode
pnpm docs:build   # Build docs to docs/dist/
```

## Architecture

- **Source structure**: `src/<domain>/` — each module has its own directory with an `index.ts` re-exporting all functions
- **Tests**: Co-located with source files using `.test.ts` suffix
- **Internal utilities**: `src/_internal/` contains shared helpers:
  - `tags.ts` — type tag constants (lowercase strings matching `Object.prototype.toString` output)
  - `types.ts` — shared interfaces (`CancelOptions`, `Cancel`, `FnNoReturn`)
  - `deepCloneImpl.ts` — recursive clone implementation used by `clone()` and `deepFreeze()`
  - `iterator.ts` — operation type constants for `ArrayIterator` / `ObjectIterator` lazy evaluation chains
  - `reflect.ts` — re-exports `Reflect.deleteProperty` for use in `deleteKey`
- **Build**: tsdown bundles `src/index.ts` → ESM with `.d.ts` declarations, fixedExtension disabled
- **Publishing**: Dual publish — npm from `dist/`, JSR directly from `src/` (see `jsr.json` include/exclude)
- **Domains**: array, date, error, event, function, guard, math, object, predicate, promise, string, types, url, util
- **Runtime support**: Zero dependencies, works in any JavaScript runtime

## Predicate vs Guard Modules

- **predicate**: Type guard functions (return `boolean` or `value is Type`)
- **guard**: Functions that throw errors or coerce values (e.g., `toNumber`, `toError`)

## Type Detection Pattern

Use `typeOf(value) === T_MAP` pattern: import tag constants from `src/_internal/tags.ts` and use `typeOf()` from `src/predicate/type-of.ts`. Tag constants are lowercase (e.g., `T_MAP = 'map'`) but `Object.prototype.toString` returns capitalized (`'[object Map]'`).

## TypeScript

- Extends `@pengzhanbo/tsconfig` base configs
- `isolatedDeclarations: true` — exported functions must have explicit return type annotations
- Tests run with `TZ=Etc/UTC` for consistent date/time results
- Prefer `Number.NaN` over global `NaN` (lint-enforced)
- Each module file includes a `@module` JSDoc tag

## Adding New Utilities

- Reuse existing utilities from `src/predicate/` and `src/guard/` instead of duplicating logic
- Use `typeOf()` for cross-realm type checking, `isTypeof()` for `typeof`-based checks
- Add a corresponding `.test.ts` file with real-world-scenario-driven tests targeting 100% coverage

## Pre-commit Hooks

Husky + lint-staged runs on commit:

- `*.{js,ts,mjs,cjs}` — `pnpm lint`
- `*` — `oxfmt`
- `*.{js,ts}` — `vitest related --run`

## CI/CD

Six GitHub Actions workflows in `.github/workflows/`: `test.yaml`, `lint.yaml`, `release.yaml`, `jsr-publish.yaml`, `deploy.yaml` (docs), `benchmark.yml`.

## Documentation

TypeDoc generates docs with plugins: `typedoc-github-theme`, `typedoc-plugin-coverage`, `typedoc-plugin-mdn-links`, `typedoc-plugin-missing-exports`. Settings: `excludeInternal: true`, `excludePrivate: true`, `router: category`.

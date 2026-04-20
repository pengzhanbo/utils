# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@pengzhanbo/utils` is a zero-dependency JavaScript/TypeScript utility library published to both JSR and npm. It provides common utility functions across multiple domains.

## Commands

```sh
pnpm build        # Build with tsdown (ESM output to dist/)
pnpm lint         # Lint with oxlint (type-check + type-aware)
pnpm format       # Format with oxfmt
pnpm test         # Run vitest with coverage (TZ=Etc/UTC for consistency)
pnpm test -- src/array/uniq.test.ts  # Run a single test file
pnpm release      # bumpp + commit + push + tag (interactive)
pnpm release:publish  # Publish to npm/JSR
```

## Architecture

- **Source structure**: `src/<domain>/` with each module having its own directory and index.ts re-exporting all functions
- **Tests**: Co-located with source files using `.test.ts` suffix
- **Internal utilities**: `src/_internal/` contains shared implementation helpers (`types`, `compare-values`, `tags`, `deepCloneImpl`, `find-index`, `iterator`, `reflect`) used across multiple domains
- **Build**: Uses tsdown with ESM format, generates `.d.ts` declarations
- **Domains**: array, date, error, event, function, guard, math, object, predicate, promise, string, types, url, util
- **Publishing**: Dual publish to npm (`@pengzhanbo/utils`) and JSR (`@pengzhanbo/utils`)
- **Runtime support**: Zero dependencies, works in any JavaScript runtime (browser, Node.js, Bun, Deno, etc.)

## Predicate vs Guard Modules

- **predicate**: Type guard functions (return `boolean` or `value is Type`)
- **guard**: Functions that throw errors or transform values (e.g., `toNumber`, `toError`)

## Type Detection Pattern

Use `toString(value) === '[object Type]'` for cross-realm type detection. Constants in `src/_internal/tags.ts` are lowercase (e.g., `T_MAP = 'map'`) but `Object.prototype.toString` returns capitalized (e.g., `'[object Map]'`).

## TypeScript

- Uses `@pengzhanbo/tsconfig` for base config (tsconfig.lib.json for library)
- `isolatedDeclarations: true` requires explicit return type annotations on exported functions
- Tests run with `TZ=Etc/UTC` timezone to ensure consistent date/time results
- Each module file includes a `@module` JSDoc tag and bilingual comment header (English/Chinese)
- Prefer `Number.NaN` over global `NaN` (enforced by lint rule)

## Adding New Utilities

- **Reuse existing utilities**: When implementing new functions, prefer composing existing utilities rather than duplicating logic. Check `src/predicate/` and `src/guard/` for available helpers.
- **Type detection**: Use `typeOf()` from `src/predicate/type-of.ts` for cross-realm type checking. For `typeof`-based checks, use `isTypeof()` from `src/predicate/is-typeof.ts`.

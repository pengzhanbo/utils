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
- **Internal utilities**: `src/_internal/` contains shared implementation helpers (types, compare-values, tags, deepCloneImpl)
- **Build**: Uses tsdown with ESM format, generates `.d.ts` declarations
- **Domains**: array, date, error, event, function, guard, math, object, predicate, promise, string, types, url, util
- **Publishing**: Dual publish to npm (`@pengzhanbo/utils`) and JSR (`@pengzhanbo/utils`)

## TypeScript

- Uses `@pengzhanbo/tsconfig` for base config (tsconfig.lib.json for library)
- `isolatedDeclarations: true` requires explicit return type annotations on exported functions
- Tests run with `TZ=Etc/UTC` timezone to ensure consistent date/time results

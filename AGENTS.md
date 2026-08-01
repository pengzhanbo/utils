# Repository Guidelines

## Project Overview

`@pengzhanbo/utils` — a zero-dependency TypeScript utility library ("a common JavaScript utility library, zero dependencies, any runtime"). Runs in browsers and Node.js; ships as ESM. Published to both npm (from `dist/`, built by tsdown) and JSR (from `src/` directly). ~14 domain modules covering array, object, string, promise, function, predicate, guard, math, url, date, error, event, types, util.

## Architecture & Data Flow

- **Barrel exports at every level**: `src/index.ts` re-exports each domain module (`export * from './array'`); each domain dir has its own `index.ts` re-exporting its files in alphabetical order. No default or wildcard exports anywhere.
- **One export per file**: mostly a single named function or class per kebab-case file (`src/string/camel-case.ts` → `export function camelCase`). Exceptions group closely related variants (e.g. `src/object/clone.ts` exports `simpleClone`/`shallowClone`/`deepClone`).
- **`src/_internal/`** holds private shared helpers, all marked `@internal`: `tags.ts` (lowercase `T_*` string constants + `DANGEROUS_KEYS`), `deepCloneImpl.ts`, `iterator.ts` (`OPERATION_*` op tags), `types.ts` (`Cancel`, `CancelOptions`, `FnNoReturn`). Imported by relative path only from sibling modules.
- **`src/types/`** is type-level only (no runtime code): `Prettify`, `Primitive`, `DeepPartial`, etc. Import with `import type`.
- **Custom errors** (`src/error/`): `TimeoutError`, `RetryError` (adds readonly `attempts`), `AbortError` — all extend `Error`, set `this.name` in constructor, accept `ErrorOptions` for `cause`.
- **Lazy iterators**: `ArrayIterator`/`ObjectIterator` implement `[Symbol.iterator](): Generator<T>` with chainable `.filter/.map/.drop/.take()` and runtime-validated args.
- **Build flow**: `src/index.ts` → tsdown → `dist/` (ESM `.js` + `.d.ts`). npm consumes `dist/`, JSR consumes `src/`.

## Key Directories

| Path                           | Purpose                                                                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/<domain>/`                | One dir per domain: `array`, `object`, `string`, `promise`, `function`, `predicate`, `guard`, `math`, `url`, `date`, `error`, `event`, `types`, `util` |
| `src/_internal/`               | Private shared helpers (not exported publicly)                                                                                                         |
| `src/__benchmarks__/<domain>/` | Vitest `bench()` benchmarks + `helpers/` (fixtures, data generators)                                                                                   |
| `scripts/`                     | `check-benchmark.js` — CI benchmark regression gate (CJS, no npm wrapper)                                                                              |
| `docs/`                        | `theme/custom.css` (hand-authored); `dist/` is entirely TypeDoc build output (cleanOutputDir)                                                          |
| `.github/workflows/`           | test, lint, release, jsr-publish, deploy, benchmark                                                                                                    |

## Development Commands

```sh
pnpm install                  # pnpm@11.18.0 pinned via packageManager
pnpm build                    # tsdown → dist/ (ESM + dts)
pnpm test                     # vitest --coverage (watch mode)
pnpm test:unit                # vitest run --coverage (CI)
pnpm test:bench               # vitest bench
pnpm test:bench:json          # bench → benchmark-results.json (CI)
pnpm lint                     # oxlint . --type-check --type-aware
pnpm format                   # oxfmt .
pnpm docs:dev / docs:build    # TypeDoc watch / build to docs/dist
pnpm release                  # bumpp version bump (package.json + jsr.json, commit/push/tag)
pnpm release:publish          # pnpm publish --provenance
```

Test/lint/format commands run with `TZ=Etc/UTC` (via `cross-env`) for deterministic date results. Pre-commit hook (`simple-git-hooks` → `nano-staged`) runs: oxlint, oxfmt, and `vitest related --run` on staged files.

## Code Conventions & Common Patterns

- **Explicit return types**: `isolatedDeclarations: true` — every exported function/class MUST declare its return type (lint-enforced). e.g. `export function clamp(n: number, min: number, max: number): number`.
- **JSDoc is mandatory and bilingual (Chinese + English)**: each file has `@module`; every public export has summary, `@category`, `@param`/`@returns` (dual-language), `@remarks`, `@see {@link Symbol}`, `@example`. No `@deprecated` markers in the codebase.
- **Naming**: functions camelCase verbs (`ensurePrefix`, `isPlainObject`); files kebab-case (`deep-merge.ts`, `is-browser.ts`); type params `T`, `K`, `V`; type predicates use `s is T` narrowing.
- **String constants over literals**: import from `src/_internal/tags.ts` (`T_UNDEFINED`, `T_ARRAY`, …) instead of hardcoding; note tags are lowercase while `Object.prototype.toString` output is capitalized. Prefer `Number.NaN` over global `NaN` (lint-enforced).
- **Type checking**: use `typeOf()` for cross-realm checks, `isTypeof()` for `typeof`-based checks. Reuse existing `src/predicate/` and `src/guard/` utilities instead of reimplementing (`isBrowser` style checks use `typeof window !== T_UNDEFINED`).
- **Overloads**: JSDoc overloads + single implementation signature (e.g. `src/function/invoke.ts`); option-object parameters destructured with defaults (e.g. `src/promise/retry.ts`).
- **Imports**: relative paths, no path aliases; `import type` for type-only imports; modules import from siblings (e.g. `emitter.ts` uses `invoke()`/`remove()`).
- **Browser/node safety**: guard node-only paths (istanbul ignore comments where unavoidable).

## Important Files

| File                                   | Why                                                                                                                     |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `src/index.ts`                         | Root barrel — public API surface; TypeDoc entry point                                                                   |
| `package.json`                         | Scripts, exports map (`./dist/index.js`), `sideEffects: false`, `files: ["dist"]`                                       |
| `tsdown.config.ts`                     | Build config; post-build comment-strip + oxfmt re-format of `dist/index.js`                                             |
| `tsconfig.json` / `tsconfig.node.json` | Extends `@pengzhanbo/tsconfig` presets; `isolatedDeclarations: true`; node config covers build-tool files + `shim.d.ts` |
| `vitest.config.ts`                     | Test include `**/*.test.[tj]s`, `TZ=Etc/UTC`, v8 coverage (text/clover/json)                                            |
| `oxlint.config.ts` / `oxfmt.config.ts` | Extend `@pengzhanbo/oxc-config` presets                                                                                 |
| `jsr.json`                             | JSR publish config — exports `./src/index.ts`, excludes tests/benchmarks                                                |
| `typedoc.json`                         | Docs: category router, 4 plugins, out `docs/dist`                                                                       |
| `shim.d.ts`                            | Ambient module for `strip-comments-strings` (build dep only, not runtime)                                               |
| `CLAUDE.md`                            | Pre-existing AI conventions doc — keep this file consistent with it                                                     |
| `scripts/check-benchmark.js`           | Benchmark regression gate used by CI                                                                                    |

## Runtime/Tooling Preferences

- **Package manager**: pnpm only, pinned `pnpm@11.18.0` (`packageManager` field); `pnpm-lock.yaml` is committed; CI uses `--frozen-lockfile`.
- **Runtime**: Node 24 in CI; library targets "any runtime" (browser + Node). TypeScript 6.0.3.
- **Toolchain is Oxc-based**: oxlint (`--type-check --type-aware`, GitHub annotation format in CI), oxfmt, and the oxc VSCode extension (default formatter, `formatOnSave`, `source.fixAll.oxc`). Formatting style: single quotes, no semicolons, `bracketSpacing: false`, 2-space indent, LF, final newline (`.editorconfig`).
- **Publishing**: npm with provenance (tag `v*` → test → build → publish + changelogithub); JSR publish in parallel workflow; `release` bumps both `package.json` and `jsr.json` via bumpp.
- **Renovate** manages dependency updates (standard preset); `pnpm-workspace.yaml` pins `@pengzhanbo/oxc-config`/`@pengzhanbo/tsconfig` minimum release age.

## Testing & QA

- **Framework**: Vitest 4, **no globals** — always `import { describe, expect, it, vi } from 'vitest'`.
- **Colocation**: test files sit next to implementations, `*.test.ts` suffix, kebab-case (`src/array/range.test.ts`). ~130 test files. No `__tests__` dirs, no snapshots, no `.skip`/`.only`.
- **Structure**: `describe('module > functionName', …)`; table-driven cases via `it.each([...])('%s => %s', …)`; standalone `it()` blocks for error paths; section divider comments `// ===== Section / 中文名 =====` in larger files.
- **Async/errors**: `await expect(p).rejects.toThrow(TimeoutError)`, `.resolves.toBe(...)`; timers via `vi.useFakeTimers()` + `vi.advanceTimersByTime()`; mocks via `vi.fn()`/`vi.spyOn()`.
- **Type-level tests**: `expectTypeOf<Result>().toEqualTypeOf<...>()` (see `src/types/deep.test.ts`).
- **Coverage**: v8 provider, no thresholds configured, but CLAUDE.md convention: **every new util ships with a `.test.ts` targeting 100% coverage**; coverage uploaded to Codecov in CI.
- **Benchmarks**: `src/__benchmarks__/<domain>/<fn>.bench.ts` using `bench(name, fn, { time, iterations })`; reusable fixtures in `src/__benchmarks__/helpers/` (`fixtures.ts` SMALL/MEDIUM/LARGE datasets, `data-generators.ts`). CI runs `test:bench:json` then `scripts/check-benchmark.js --baseline docs/benchmark-baseline.json --threshold 20` — a regression >20% vs baseline fails the build; first run creates the baseline.

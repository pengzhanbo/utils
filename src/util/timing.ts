/**
 * Create a high-resolution performance timer.
 *
 * 创建一个高精度性能计时器。
 *
 * @category Util
 *
 * @returns A function that returns the elapsed milliseconds since the timer was created.
 * The returned function can be called multiple times, each time returning the elapsed
 * time from the original creation point.
 *
 * 返回一个函数，该函数返回自计时器创建以来经过的毫秒数。
 * 返回的函数可以多次调用，每次返回自创建点以来的经过时间。
 *
 * @remarks
 * Uses `performance.now()` for sub-millisecond precision. Falls back to `Date.now()`
 * if `performance` is not available in the runtime.
 *
 * 使用 `performance.now()` 实现亚毫秒级精度。如果运行时没有 `performance`，则回退到 `Date.now()`。
 *
 * @example
 * ```ts
 * const timer = timing()
 * // ... do some work ...
 * const elapsed = timer() // e.g. 1.234
 * ```
 *
 * @example
 * Measure multiple checkpoints:
 * ```ts
 * const timer = timing()
 * doSomething()
 * const t1 = timer() // time after doSomething
 * doSomethingElse()
 * const t2 = timer() // total time including doSomethingElse
 * ```
 */
export function timing(): () => number {
  const start = performance.now()
  return () => performance.now() - start
}

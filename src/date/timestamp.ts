/**
 * Get the current timestamp in milliseconds since the Unix epoch.
 *
 * 获取自 Unix 纪元以来的当前时间戳（毫秒）。
 *
 * @category Date
 *
 * @returns The current timestamp in milliseconds. 当前时间戳（毫秒）
 *
 * @example
 * ```ts
 * const ts = timestamp() // => 1700000000000 (example)
 * ```
 *
 * @example
 * Measuring elapsed time:
 * ```ts
 * const start = timestamp()
 * // ... some operation
 * const elapsed = timestamp() - start
 * ```
 */
export function timestamp(): number {
  return Date.now()
}

import type { Finite } from '../types/numeric'

/**
 * A strongly-typed version of `Number.isFinite()`.
 *
 * `Number.isFinite()` 的强类型版本。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is finite, false otherwise. 如果值为有限数则返回true，否则返回false
 *
 * @example
 * ```ts
 * isFinite(1) // => true
 * isFinite(Number.INFINITY) // => true
 * ```
 */
export function isFinite<T extends number>(v: T): v is Finite<T> {
  return Number.isFinite(v)
}

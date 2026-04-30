import type { Finite } from '../types/numeric'

/**
 * A strongly-typed version of `Number.isFinite()`.
 *
 * `Number.isFinite()` 的强类型版本。
 *
 * @category Predicate
 *
 * @typeParam T extends number - The type of the number value / 数值类型
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is finite, false otherwise. 如果值为有限数则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isFinite(1) // => true
 * isFinite(0) // => true
 * isFinite(-1) // => true
 * isFinite(Infinity) // => false
 * isFinite(-Infinity) // => false
 * isFinite(NaN) // => false
 * ```
 */
export function isFinite<T extends number>(v: T): v is Finite<T> {
  return Number.isFinite(v)
}

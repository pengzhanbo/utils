import type { Integer } from '../types/numeric'

/**
 * A strongly-typed version of `Number.isSafeInteger()`.
 *
 * `Number.isSafeInteger()` 的强类型版本。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a safe integer, false otherwise. 如果值为安全整数则返回true，否则返回false
 *
 * @example
 * ```ts
 * isSafeInteger(1) // => true
 * isSafeInteger(1.1) // => false
 * ```
 */
export function isSafeInteger<T>(v: T): v is Integer<T> {
  return Number.isSafeInteger(v)
}

import type { Integer } from '../types/numeric'

/**
 * Checks if the input is an integer
 *
 * 检查输入是否为整数
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is an integer, false otherwise. 如果值为整数则返回true，否则返回false
 *
 * @example
 * ```ts
 * isInteger(1) // => true
 * isInteger(1.1) // => false
 * ```
 */
export function isInteger<T>(v: T): v is Integer<T> {
  return Number.isInteger(v)
}

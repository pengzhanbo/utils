import { T_DATE } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is a date.
 *
 * 检查输入是否为日期。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is a date, false otherwise. 如果值为日期则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isDate(new Date()) // => true
 * isDate('2024-01-01') // => false
 * ```
 */
export function isDate(v: unknown): v is Date {
  return isTypeof(v, T_DATE)
}

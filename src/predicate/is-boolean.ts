import { T_BOOLEAN } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is a boolean
 *
 * 检查输入是否为布尔值
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a boolean, false otherwise. 如果值为布尔值则返回true，否则返回false
 */
export function isBoolean(v: unknown): v is boolean {
  return isTypeof(v, T_BOOLEAN)
}

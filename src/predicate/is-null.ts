import { T_NULL } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is null
 *
 * 检查输入是否为null
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is null, false otherwise. 如果值为null则返回true，否则返回false
 */
export function isNull(v: unknown): v is null {
  return isTypeof(v, T_NULL)
}

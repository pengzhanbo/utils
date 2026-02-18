import { T_UNDEFINED } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is undefined
 *
 * 检查输入是否为undefined
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is undefined, false otherwise. 如果值为undefined则返回true，否则返回false
 */
export function isUndefined(v: unknown): v is undefined {
  return isTypeof(v, T_UNDEFINED)
}

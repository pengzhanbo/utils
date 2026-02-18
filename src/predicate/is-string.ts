import { T_STRING } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is a string
 *
 * 检查输入是否为字符串
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a string, false otherwise. 如果值为字符串则返回true，否则返回false
 */
export function isString(v: unknown): v is string {
  return isTypeof(v, T_STRING)
}

import { T_NUMBER } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is a number
 *
 * 检查输入是否为数字
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a number, false otherwise. 如果值为数字则返回true，否则返回false
 */
export function isNumber(v: unknown): v is number {
  return isTypeof(v, T_NUMBER)
}

import { T_REGEXP } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is a regexp
 *
 * 检查输入是否为正则表达式
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a regexp, false otherwise. 如果值为正则表达式则返回true，否则返回false
 */
export function isRegexp(v: unknown): v is RegExp {
  return isTypeof(v, T_REGEXP)
}

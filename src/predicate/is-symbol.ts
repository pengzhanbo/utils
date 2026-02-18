import { T_SYMBOL } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is a symbol
 *
 * 检查输入是否为符号
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a symbol, false otherwise. 如果值为符号则返回true，否则返回false
 */
export function isSymbol(v: unknown): v is symbol {
  return isTypeof(v, T_SYMBOL)
}

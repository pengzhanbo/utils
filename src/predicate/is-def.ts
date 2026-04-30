import { T_UNDEFINED } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is defined.
 *
 * 检查输入是否已定义。
 *
 * @category Predicate
 *
 * @typeParam T - The type of the value to check / 要检查的值的类型
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is defined, false otherwise. 如果值已定义则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isDef(0) // => true
 * isDef(null) // => true
 * isDef(undefined) // => false
 * ```
 */
export function isDef<T = any>(v?: T): v is T {
  return !isTypeof(v, T_UNDEFINED)
}

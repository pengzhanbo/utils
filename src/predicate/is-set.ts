import { T_SET } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is a Set.
 *
 * 检查输入是否为 Set。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is a Set, false otherwise. 如果值为 Set 则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isSet(new Set()) // => true
 * isSet([]) // => false
 * ```
 */
export function isSet(v: unknown): v is Set<unknown> {
  return isTypeof(v, T_SET)
}

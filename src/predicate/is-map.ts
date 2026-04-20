import { T_MAP } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is a Map
 *
 * 检查输入是否为 Map
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a Map, false otherwise. 如果值为 Map 则返回 true，否则返回 false
 */
export function isMap(v: unknown): v is Map<unknown, unknown> {
  return isTypeof(v, T_MAP)
}

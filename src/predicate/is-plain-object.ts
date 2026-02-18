import { T_OBJECT } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is an object
 *
 * 检查输入是否为对象
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is an object, false otherwise. 如果值为对象则返回true，否则返回false
 */
export function isPlainObject(v: unknown): v is Record<PropertyKey, unknown> {
  return isTypeof(v, T_OBJECT)
}

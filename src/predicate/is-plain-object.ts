import { T_OBJECT } from '../_internal/tags'
import { isNull } from './is-null'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is an object.
 *
 * 检查输入是否为对象。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is an object, false otherwise. 如果值为对象则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isPlainObject({}) // => true
 * isPlainObject(new Map()) // => false
 * isPlainObject(Object.create(null)) // => true
 * ```
 */
export function isPlainObject(v: unknown): v is Record<PropertyKey, unknown> {
  if (!isTypeof(v, T_OBJECT)) return false
  const proto = Object.getPrototypeOf(v)
  return isNull(proto) || proto === Object.prototype
}

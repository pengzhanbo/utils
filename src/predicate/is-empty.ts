import { isArray } from './is-array'
import { isBuffer } from './is-buffer'
import { isEmptyObject } from './is-empty-object'
import { isMap } from './is-map'
import { isNil } from './is-nil'
import { isSet } from './is-set'
import { isString } from './is-string'

/**
 * Checks if a value is empty
 *
 * 检查值是否为空
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is empty, false otherwise. 如果值为空则返回 true，否则返回 false
 */
export function isEmpty(v: unknown): boolean {
  if (isNil(v)) return true

  if (isString(v) || isArray(v) || isBuffer(v)) return v.length === 0

  if (isMap(v) || isSet(v)) return v.size === 0

  return isEmptyObject(v)
}

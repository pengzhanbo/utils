import { T_STRING } from '../_internal/tags'
import { isJSONValue } from './is-json-value'
import { isPlainObject } from './is-plain-object'

/**
 * Checks if a value is a JSON object.
 *
 * 检查一个值是否为JSON对象
 *
 * @category Predicate
 *
 * @param obj - The value to check. 要检查的值
 * @returns True if the value is a JSON object, false otherwise. 如果值为JSON对象则返回true，否则返回false
 */
export function isJSONObject(obj: unknown): obj is Record<string, any> {
  if (!isPlainObject(obj)) {
    return false
  }

  const keys = Reflect.ownKeys(obj)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!
    const value = obj[key]

    /* istanbul ignore if -- @preserve */
    // oxlint-disable-next-line valid-typeof
    if (typeof key !== T_STRING) {
      return false
    }

    if (!isJSONValue(value)) {
      return false
    }
  }

  return true
}

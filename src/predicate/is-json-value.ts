import { T_BOOLEAN, T_NUMBER, T_OBJECT, T_STRING } from '../_internal/tags'
import { isJSONArray } from './is-json-array'
import { isJSONObject } from './is-json-object'

/**
 * Checks if a given value is a valid JSON value.
 *
 * 检查给定值是否为有效的JSON值
 *
 * @category Predicate
 *
 * @param value - The value to check. 要检查的值
 * @returns True if the value is a valid JSON value, false otherwise. 如果值是有效的JSON值则返回true，否则返回false
 */
export function isJSONValue(
  value: unknown,
): value is Record<string, any> | any[] | string | number | boolean | null {
  switch (typeof value) {
    case T_OBJECT: {
      return value === null || isJSONArray(value) || isJSONObject(value)
    }
    case T_STRING:
    case T_NUMBER:
    case T_BOOLEAN:
      return true

    default:
      return false
  }
}

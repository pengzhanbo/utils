import { isJSONValue } from './is-json-value'

/**
 * Checks if a given value is a valid JSON array.
 *
 * 检查给定值是否为有效的JSON数组
 *
 * @category Predicate
 *
 * @param value - The value to check. 要检查的值
 * @returns True if the value is a valid JSON array, false otherwise. 如果值是有效的JSON数组则返回true，否则返回false
 */
export function isJSONArray(value: unknown): value is any[] {
  if (!Array.isArray(value)) {
    return false
  }

  return value.every((item) => isJSONValue(item))
}

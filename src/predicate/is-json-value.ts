import { T_BOOLEAN, T_NUMBER, T_OBJECT, T_STRING } from '../_internal/tags'
import { isFinite } from './is-finite'
import { isJSONArray } from './is-json-array'
import { isJSONObject } from './is-json-object'

/**
 * Checks if a given value is a valid JSON value.
 *
 * 检查给定值是否为有效的 JSON 值。
 *
 * @category Predicate
 *
 * @param value - The value to check. 要检查的值
 *
 * @returns True if the value is a valid JSON value, false otherwise. 如果值是有效的 JSON 值则返回 true，否则返回 false
 *
 * @remarks
 * For numeric values, this function uses `isFinite()` to check validity. `NaN` and `Infinity` return `false`
 * because they are not valid JSON values per the JSON specification.
 *
 * 对于数值，该函数使用 `isFinite()` 检查有效性。`NaN` 和 `Infinity` 返回 `false`，
 * 因为根据 JSON 规范，它们不是有效的 JSON 值。
 *
 * @see {@link isJSONArray} and {@link isJSONObject} — for structured JSON validation
 * @see {@link isJSONArray} 和 {@link isJSONObject} — 结构化 JSON 验证
 *
 * @example
 * ```ts
 * isJSONValue('hello') // => true
 * isJSONValue(42) // => true
 * isJSONValue(true) // => true
 * isJSONValue(null) // => true
 * isJSONValue([1, 2, 3]) // => true
 * isJSONValue({ a: 1 }) // => true
 * isJSONValue(() => {}) // => false
 * isJSONValue(Symbol()) // => false
 * isJSONValue(undefined) // => false
 * isJSONValue(NaN) // => false
 * isJSONValue(Infinity) // => false
 * ```
 */
export function isJSONValue(
  value: unknown,
): value is Record<string, any> | any[] | string | number | boolean | null {
  switch (typeof value) {
    case T_OBJECT: {
      return value === null || isJSONArray(value) || isJSONObject(value)
    }
    case T_NUMBER:
      return isFinite(value as number)
    case T_STRING:
    case T_BOOLEAN:
      return true

    default:
      return false
  }
}

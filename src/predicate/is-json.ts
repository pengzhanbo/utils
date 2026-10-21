import { T_BOOLEAN, T_NUMBER, T_OBJECT, T_STRING } from '../_internal/tags.js'
import { objectKeys } from '../object/keys.js'
import { isFinite } from './is-finite.js'
import { isPlainObject } from './is-plain-object.js'

/**
 * Checks if a given value is a valid JSON array.
 *
 * 检查给定值是否为有效的 JSON 数组。
 *
 * @category Predicate
 *
 * @param value - The value to check. 要检查的值
 *
 * @returns True if the value is a valid JSON array, false otherwise. 如果值是有效的 JSON 数组则返回 true，否则返回 false
 *
 * @remarks
 * This function recursively validates each element using `isJSONValue`. For deeply nested arrays,
 * this can result in a large call stack and may hit the stack size limit of the runtime.
 *
 * 该函数使用 `isJSONValue` 递归验证每个元素。对于深度嵌套的数组，
 * 这可能导致较大的调用栈，并可能达到运行时的栈大小限制。
 *
 * @example
 * ```ts
 * isJSONArray([1, 2, 3]) // => true
 * isJSONArray([() => {}]) // => false
 * ```
 */
export function isJSONArray(value: unknown): value is any[] {
  if (!Array.isArray(value)) {
    return false
  }

  return value.every((item) => isJSONValue(item))
}

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
  // oxlint-disable-next-line typescript/switch-exhaustiveness-check
  switch (typeof value) {
    case T_OBJECT: {
      return value == null || isJSONArray(value) || isJSONObject(value)
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

/**
 * Checks if a value is a JSON object.
 *
 * 检查一个值是否为 JSON 对象。
 *
 * @category Predicate
 *
 * @param obj - The value to check. 要检查的值
 *
 * @returns True if the value is a JSON object, false otherwise. 如果值为 JSON 对象则返回 true，否则返回 false
 *
 * @remarks
 * This function recursively validates each property value using `isJSONValue`. For deeply nested objects,
 * this can result in a large call stack and may hit the stack size limit of the runtime.
 *
 * 该函数使用 `isJSONValue` 递归验证每个属性值。对于深度嵌套的对象，
 * 这可能导致较大的调用栈，并可能达到运行时的栈大小限制。
 *
 * @example
 * ```ts
 * isJSONObject({ a: 1 }) // => true
 * isJSONObject({ a: () => {} }) // => false
 * ```
 */
export function isJSONObject(obj: unknown): obj is Record<string, any> {
  if (!isPlainObject(obj)) {
    return false
  }

  const keys = objectKeys(obj)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!
    const value = obj[key]

    if (!isJSONValue(value)) {
      return false
    }
  }

  return true
}

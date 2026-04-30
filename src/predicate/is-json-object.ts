import { objectKeys } from '../object'
import { isJSONValue } from './is-json-value'
import { isPlainObject } from './is-plain-object'

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

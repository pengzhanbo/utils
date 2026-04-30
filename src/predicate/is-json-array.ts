import { isJSONValue } from './is-json-value'

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

/**
 * Checks if the input is an array.
 *
 * 检查输入是否为数组。
 *
 * @category Predicate
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is an array, false otherwise. 如果值为数组则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isArray([1, 2, 3]) // => true
 * isArray('foo') // => false
 * ```
 */
export function isArray<T>(v: unknown): v is T[] {
  return Array.isArray(v)
}

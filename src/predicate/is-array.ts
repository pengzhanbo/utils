/**
 * Checks if the input is an array
 *
 * 检查输入是否为数组
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is an array, false otherwise. 如果值为数组则返回true，否则返回false
 */
export function isArray<T>(v: unknown): v is T[] {
  return Array.isArray(v)
}

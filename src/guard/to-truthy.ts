/**
 * guard function that returns if val is truthy
 *
 * 守卫函数，返回 val 是否为真值
 *
 * @category Guard
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 *
 * @param val - The value to check. 要检查的值
 * @returns True if the value is truthy, false otherwise. 如果值为真值则返回true，否则返回false
 *
 * @example
 * ```ts
 * [1, 2, 3, '', false, undefined].filter(toTruthy) // => [1, 2, 3]
 * ```
 */
export function toTruthy<T>(val: T): val is NonNullable<T> {
  return Boolean(val)
}

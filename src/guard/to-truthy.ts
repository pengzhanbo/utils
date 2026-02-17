/**
 * guard function that returns if val is truthy
 *
 * 守卫函数，返回 val 是否为真值
 *
 * @category Guard
 *
 * @param val - The value to check. 要检查的值
 * @returns True if the value is truthy, false otherwise. 如果值为真值则返回true，否则返回false
 *
 * @example
 * ```ts
 * [1, 2, 3, '', false, undefined].filter(toTruthy) // => [1, 2, 3]
 * ```
 */
export function toTruthy(val: unknown): boolean {
  return Boolean(val)
}

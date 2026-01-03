/**
 * guard function that returns if val is truthy
 *
 * 守卫函数，返回 val 是否为真值
 *
 * @category Function
 * @example
 * ```ts
 * [1, 2, 3, '', false, undefined].filter(toTruthy) // => [1, 2, 3]
 * ```
 */
export function toTruthy(val: unknown): boolean {
  return Boolean(val)
}

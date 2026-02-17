/**
 * guard function that returns if val is not null or undefined
 *
 * 守卫函数，返回 val 不为 null 或 undefined
 *
 * @category Guard
 *
 * @param val - The value to check. 要检查的值
 * @returns True if the value is not null or undefined, false otherwise. 如果值不是null或undefined则返回true，否则返回false
 *
 * @example
 * ```ts
 * [1, '', false, null, undefined].filter(notNullish) // => [1, '', false]
 * ```
 */
export function notNullish<T>(val: T | null | undefined): val is NonNullable<T> {
  return val != null
}

/**
 * guard function that returns if val is not null or undefined
 *
 * 守卫函数，返回 val 不为 null 或 undefined
 *
 * @category Function
 * @example
 * ```ts
 * [1, '', false, null, undefined].filter(notNullish) // => [1, '', false]
 * ```
 */
export function notNullish<T>(val: T | null | undefined): val is NonNullable<T> {
  return val != null
}

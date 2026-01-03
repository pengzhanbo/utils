/**
 * Get the string representation of a value
 *
 * 获取值的字符串表示
 *
 * @category Common
 */
export function toString(s: unknown): string {
  return Object.prototype.toString.call(s)
}

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

/**
 * guard function that returns if val is not undefined
 *
 * 守卫函数，返回 val 不为 undefined
 *
 * @category Function
 * @example
 * ```ts
 * [1, '', false, undefined].filter(NotUndefined) // => [1, '', false]
 * ```
 */
export function notUndefined(val: unknown): boolean {
  return typeof val !== 'undefined'
}

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

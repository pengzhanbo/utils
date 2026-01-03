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

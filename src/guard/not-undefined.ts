/**
 * guard function that returns if val is not undefined
 *
 * 守卫函数，返回 val 不为 undefined
 *
 * @category Guard
 *
 * @param val - The value to check. 要检查的值
 * @returns True if the value is not undefined, false otherwise. 如果值不是undefined则返回true，否则返回false
 *
 * @example
 * ```ts
 * [1, '', false, undefined].filter(notUndefined) // => [1, '', false]
 * ```
 */
export function notUndefined(val: unknown): boolean {
  return typeof val !== 'undefined'
}

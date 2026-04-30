/**
 * Checks if the input is undefined.
 *
 * 检查输入是否为 undefined。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is undefined, false otherwise. 如果值为 undefined 则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isUndefined(undefined) // => true
 * isUndefined(null) // => false
 * ```
 */
export function isUndefined(v: unknown): v is undefined {
  return v === undefined
}

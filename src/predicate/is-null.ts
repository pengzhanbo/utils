/**
 * Checks if the input is null.
 *
 * 检查输入是否为 null。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is null, false otherwise. 如果值为 null 则返回 true，否则返回 false
 *
 * @see {@link isNil} — for checking both null and undefined
 * @see {@link isNil} — 检查 null 和 undefined
 *
 * @example
 * ```ts
 * isNull(null) // => true
 * isNull(undefined) // => false
 * ```
 */
export function isNull(v: unknown): v is null {
  return v === null
}

import { isPlainObject } from './is-plain-object'

/**
 * Checks if the input is an empty object.
 *
 * 检查输入是否为空对象。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is an empty object, false otherwise. 如果值为空对象则返回 true，否则返回 false
 *
 * @remarks
 * This function uses `for...in` to enumerate enumerable string-keyed properties.
 * Symbol-keyed properties are skipped by `for...in`, so an object containing only Symbol-keyed properties
 * would be incorrectly reported as empty.
 *
 * 该函数使用 `for...in` 枚举可枚举的字符串键属性。
 * `for...in` 会跳过 Symbol 键属性，因此仅包含 Symbol 键属性的对象会被错误地报告为空。
 *
 * @example
 * ```ts
 * isEmptyObject({}) // => true
 * isEmptyObject({ a: 1 }) // => false
 * ```
 */
export function isEmptyObject(v: unknown): boolean {
  if (!isPlainObject(v)) return false
  for (const _ in v) return false

  return true
}

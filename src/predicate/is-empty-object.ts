import { isPlainObject } from './is-plain-object'

/**
 * Checks if the input is an empty object
 *
 * 检查输入是否为空对象
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is an empty object, false otherwise. 如果值为空对象则返回true，否则返回false
 */
export function isEmptyObject(v: unknown): boolean {
  if (!isPlainObject(v)) return false
  for (const _ in v) return false

  return true
}

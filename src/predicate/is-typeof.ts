import { typeOf } from './type-of'

/**
 * Checks if a value is of a given type
 *
 * 检查值是否为给定类型
 *
 * @category Common
 *
 * @param s - The value to check. 要检查的值
 * @param type - The type to check against. 要检查的类型
 * @returns True if the value is of the given type, false otherwise. 如果值为给定类型则返回true，否则返回false
 *
 * @example
 * ```ts
 * isTypeof(null, 'null') // => true
 * isTypeof(undefined, 'undefined') // => true
 * isTypeof({}, 'object') // => true
 * ```
 */
export function isTypeof(s: unknown, type: string): boolean {
  return typeOf(s) === type
}

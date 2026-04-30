import { typeOf } from './type-of'

/**
 * Checks if a value is of a given type.
 *
 * 检查值是否为给定类型。
 *
 * @category Predicate
 *
 * @param s - The value to check. 要检查的值
 * @param type - The type to check against. 要检查的类型
 *
 * @returns True if the value is of the given type, false otherwise. 如果值为给定类型则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isTypeof(null, 'null') // => true
 * isTypeof(undefined, 'undefined') // => true
 * isTypeof({}, 'object') // => true
 * isTypeof([], 'array') // => true
 * isTypeof(new Map(), 'map') // => true
 * isTypeof(() => {}, 'function') // => true
 * isTypeof(42, 'string') // => false
 * ```
 */
export function isTypeof<T>(s: unknown, type: string): s is T {
  return typeOf(s) === type
}

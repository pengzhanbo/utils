import { getTypeName } from '../_internal/get-type-name'
import { T_NULL, T_OBJECT, T_FUNCTION } from '../_internal/tags'

/**
 * Get the type of a value.
 *
 * 获取值的类型。
 *
 * @category Predicate
 *
 * @param s - The value to get the type of. 要获取类型的值
 *
 * @returns The type of the value as a string. 值的类型字符串
 *
 * @example
 * ```ts
 * typeOf(null) // => 'null'
 * typeOf([]) // => 'array'
 * typeOf(new Map()) // => 'map'
 * typeOf(new Date()) // => 'date'
 * typeOf(42) // => 'number'
 * typeOf('hello') // => 'string'
 * typeOf(() => {}) // => 'function'
 * ```
 */
export function typeOf(s: unknown): string {
  const type = typeof s
  return s === null
    ? T_NULL
    : type === T_OBJECT || type === T_FUNCTION
      ? getTypeName(s).slice(8, -1).toLowerCase()
      : type
}

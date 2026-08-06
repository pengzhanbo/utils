import { getTypeName } from '../_internal/get-type-name.js'
import { T_NULL, T_OBJECT, T_FUNCTION } from '../_internal/tags.js'

/**
 * Get the type of a value.
 *
 * 获取值的类型。
 *
 * @category Predicate
 *
 * @param v - The value to get the type of. 要获取类型的值
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
export function typeOf(v: unknown): string {
  const type = typeof v
  // oxlint-disable-next-line eqeqeq
  return v === null
    ? T_NULL
    : type === T_OBJECT || type === T_FUNCTION
      ? getTypeName(v).slice(8, -1).toLowerCase()
      : type
}

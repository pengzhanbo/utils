import { notNullish } from '../guard'

/**
 * Map key/value pairs for an object, and construct a new one
 *
 * 为一个对象映射键值对，并构造一个新对象
 *
 * @category Object
 *
 * @param obj - The source object. 源对象
 * @param mapper - The mapper function to transform key/value pairs. 用于转换键值对的映射函数
 * @returns A new object with transformed key/value pairs. 具有转换后键值对的新对象
 *
 * Transform:
 * @example
 * ```
 * objectMap({ a: 1, b: 2 }, (k, v) => [k.toString().toUpperCase(), v.toString()])
 * // { A: '1', B: '2' }
 * ```
 *
 * Swap key/value:
 * @example
 * ```
 * objectMap({ a: 1, b: 2 }, (k, v) => [v, k])
 * // { 1: 'a', 2: 'b' }
 * ```
 *
 * Filter keys:
 * @example
 * ```
 * objectMap({ a: 1, b: 2 }, (k, v) => k === 'a' ? undefined : [k, v])
 * // { b: 2 }
 * ```
 */
export function objectMap<K extends string, V, NK extends PropertyKey = K, NV = V>(
  obj: Record<K, V>,
  mapper: (key: K, value: V) => [NK, NV] | undefined,
): Record<NK, NV> {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => mapper(k as K, v as V))
      .filter(notNullish),
  ) as Record<NK, NV>
}

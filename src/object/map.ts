import { DANGEROUS_KEYS } from '../_internal/tags'
import { isUndefined } from '../predicate'

/**
 * Map key/value pairs for an object, and construct a new one
 *
 * 为一个对象映射键值对，并构造一个新对象
 *
 * @category Object
 *
 * @typeParam K - The type of the key (extends PropertyKey) / 键的类型（继承 PropertyKey）
 * @typeParam V - The type of the value / 值的类型
 * @param obj - The source object. 源对象
 * @param mapper - The mapper function to transform key/value pairs. 用于转换键值对的映射函数
 * @returns A new object with transformed key/value pairs. 具有转换后键值对的新对象
 *
 * @remarks
 * Dangerous keys (`__proto__`, `constructor`, `prototype`) are silently filtered out from the result object.
 * If the mapper function returns `undefined` for a key/value pair, that entry is removed from the result.
 *
 * 危险键（`__proto__`、`constructor`、`prototype`）会被静默过滤，不会出现在结果对象中。
 * 如果映射函数返回 `undefined`，则该键值对会从结果中被移除。
 *
 * @example
 * ```ts
 * // Transform:
 * objectMap({ a: 1, b: 2 }, (k, v) => [k.toString().toUpperCase(), v.toString()])
 * // { A: '1', B: '2' }
 * ```
 *
 * @example
 * ```ts
 * // Swap key/value:
 * objectMap({ a: 1, b: 2 }, (k, v) => [v, k])
 * // { 1: 'a', 2: 'b' }
 * ```
 *
 * @example
 * ```ts
 * // Filter keys:
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
      .filter((entry): entry is [NK, NV] => !isUndefined(entry))
      .filter(([k]) => !DANGEROUS_KEYS.has(k as string)),
  ) as Record<NK, NV>
}

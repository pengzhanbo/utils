import { isArray } from './is-array'
import { isBuffer } from './is-buffer'
import { isEmptyObject } from './is-empty-object'
import { isMap } from './is-map'
import { isNil } from './is-nil'
import { isSet } from './is-set'
import { isString } from './is-string'
import { isTypedArray } from './is-typed-array'

/**
 * Checks if a value is empty.
 *
 * 检查值是否为空。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is empty, false otherwise. 如果值为空则返回 true，否则返回 false
 *
 * @remarks
 * - For strings, arrays, buffers, and typed arrays: "empty" means a length of `0`.
 * - For Map and Set: "empty" means a size of `0`.
 * - Nil values (`null` / `undefined`) are considered empty.
 * - For plain objects: delegates to {@link isEmptyObject}, which uses `for...in` and therefore skips Symbol-keyed properties.
 *
 * - 对于字符串、数组、缓冲区和类型化数组："空"表示长度为 `0`。
 * - 对于 Map 和 Set："空"表示大小为 `0`。
 * - 空值（`null` / `undefined`）被视为空。
 * - 对于普通对象：委托给 {@link isEmptyObject}，该方法使用 `for...in`，因此会跳过 Symbol 键属性。
 *
 * @example
 * ```ts
 * isEmpty('') // => true
 * isEmpty([]) // => true
 * isEmpty(new Map()) // => true
 * isEmpty({ a: 1 }) // => false
 * ```
 */
export function isEmpty(v: unknown): boolean {
  if (isNil(v)) return true

  if (isString(v) || isArray(v) || isBuffer(v) || isTypedArray(v)) return v.length === 0

  if (isMap(v) || isSet(v)) return v.size === 0

  return isEmptyObject(v)
}

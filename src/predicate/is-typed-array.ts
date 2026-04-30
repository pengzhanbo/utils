import { T_DATAVIEW } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is a typed array.
 *
 * 检查输入是否为类型化数组。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is a typed array, false otherwise. 如果值为类型化数组则返回 true，否则返回 false
 *
 * @remarks
 * This function explicitly excludes `DataView` from typed arrays, even though `ArrayBuffer.isView()` returns `true` for `DataView`.
 * It checks that the internal type tag is not `'dataview'` to filter it out.
 *
 * 该函数明确将 `DataView` 排除在类型化数组之外，尽管 `ArrayBuffer.isView()` 对 `DataView` 返回 `true`。
 * 它通过检查内部类型标签不为 `'dataview'` 来将其过滤掉。
 *
 * @example
 * ```ts
 * isTypedArray(new Uint8Array()) // => true
 * isTypedArray(new DataView(new ArrayBuffer(8))) // => false
 * ```
 */
export function isTypedArray(
  v: unknown,
): v is
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array {
  return ArrayBuffer.isView(v) && !isTypeof(v, T_DATAVIEW)
}

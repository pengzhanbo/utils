/**
 * Checks if the input is a typed array
 *
 * 检查输入是否为类型化数组
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a typed array, false otherwise. 如果值为类型化数组则返回true，否则返回false
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
  | Float64Array {
  return ArrayBuffer.isView(v) && !(v instanceof DataView)
}

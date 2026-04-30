/**
 * Get the type name of a value.
 *
 * 获取变量的类型字符串表示
 *
 * @param s - The value to get the type name for. 要获取类型的值
 * @returns The type name of the value. 值的类型字符串表示
 *
 * @remarks
 * This function uses `Object.prototype.toString.call(value)`, which returns the internal `[[Class]]` tag in the format `[object Type]`. It does NOT call the value's own `toString()` method.
 *
 * 此函数使用 `Object.prototype.toString.call(value)`，返回内部 `[[Class]]` 标签，格式为 `[object Type]` 。
 *
 * @example
 * ```ts
 * getTypeName(42) // => '[object Number]'
 * getTypeName('hello') // => '[object String]'
 * getTypeName(undefined) // => '[object Undefined]'
 * getTypeName(null) // => '[object Null]'
 * getTypeName({}) // => '[object Object]'
 * ```
 * @internal
 */
export function getTypeName(s: unknown): string {
  return Object.prototype.toString.call(s)
}

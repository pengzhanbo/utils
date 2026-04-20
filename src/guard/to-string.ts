/**
 * Get the string representation of a value
 *
 * 获取值的字符串表示
 *
 * @category Guard
 *
 * @param s - The value to get the string representation for. 要获取字符串表示的值
 * @returns The string representation of the value. 值的字符串表示
 *
 * @example
 * ```ts
 * toString(42) // => '[object Number]'
 * toString('hello') // => '[object String]'
 * toString(undefined) // => '[object Undefined]'
 * toString(null) // => '[object Null]'
 * toString({}) // => '[object Object]'
 * ```
 */
export function toString(s: unknown): string {
  return Object.prototype.toString.call(s)
}

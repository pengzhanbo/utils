/**
 * Get the string representation of a value
 *
 * 获取值的字符串表示
 *
 * @category Guard
 *
 * @param s - The value to get the string representation for. 要获取字符串表示的值
 * @returns The string representation of the value. 值的字符串表示
 */
export function toString(s: unknown): string {
  return Object.prototype.toString.call(s)
}

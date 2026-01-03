/**
 * Get the string representation of a value
 *
 * 获取值的字符串表示
 *
 * @category Guard
 */
export function toString(s: unknown): string {
  return Object.prototype.toString.call(s)
}

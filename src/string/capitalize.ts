/**
 * First letter uppercase, other lowercase
 *
 * 首字母大写，其余小写
 *
 * @category String
 *
 * @param s - The string to capitalize. 要首字母大写的字符串
 * @returns The capitalized string. 首字母大写的字符串
 *
 * @example
 * ```ts
 * capitalize('hello') // 'Hello'
 * capitalize('WORLD') // 'World'
 * ```
 */
export function capitalize(s: string): string {
  if (!s) return s
  return s[0]!.toUpperCase() + s.slice(1).toLowerCase()
}

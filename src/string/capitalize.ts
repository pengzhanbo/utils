/**
 * First letter uppercase, other lowercase
 *
 * 首字母大写，其余小写
 *
 * @category String
 * @example
 * ```ts
 * capitalize('hello') // 'Hello'
 * capitalize('WORLD') // 'World'
 * ```
 */
export function capitalize(s: string): string {
  if (!s)
    return s
  return s[0]!.toUpperCase() + s.slice(1).toLowerCase()
}

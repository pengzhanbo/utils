import { words } from './words'

/**
 * Converts a string to constant case
 *
 * 将字符串转换为常量命名法
 *
 * @category String
 *
 * @param str - The string to convert. 要转换的字符串
 * @returns The string in constant case. 常量命名法格式的字符串
 *
 * @example
 * ```ts
 * constantCase('foo bar') // => FOO_BAR
 * constantCase('foo-bar') // => FOO_BAR
 * ```
 */
export function constantCase(str: string): string {
  if (!str) return ''

  const parts = words(str)

  if (parts.length === 0) return ''

  return parts.map((word) => word.toUpperCase()).join('_')
}

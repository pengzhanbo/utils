import { words } from './words'

/**
 * Convert string to kebab-case
 *
 * 将字符串转换为短横线命名法
 *
 * @category String
 *
 * @param str - 要转换的字符串
 * @returns 转换后的短横线命名法字符串
 *
 * @example
 * ```ts
 * kebabCase('a b c') // => a-b-c
 * kebabCase('orderBy') // => order-by
 * ```
 */
export function kebabCase(str: string): string {
  if (!str) return ''

  const parts = words(str)

  if (parts.length === 0) return ''

  return parts.map((word) => word.toLowerCase()).join('-')
}

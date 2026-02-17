import { words } from './words'

/**
 * Convert string to lowercase
 *
 * 将字符串转换为小写
 *
 * @category String
 *
 * @param str - 要转换的字符串
 * @returns 转换后的小写字符串，单词之间用空格分隔
 *
 * @example
 * ```ts
 * lowerCase('Hello World') // => 'hello world'
 * lowerCase('HELLO WORLD') // => 'hello world'
 * lowerCase('order-by') // => 'order by'
 * ```
 */
export function lowerCase(str: string): string {
  if (!str) return ''

  const parts = words(str)

  if (parts.length === 0) return ''

  return parts.map((word) => word.toLowerCase()).join(' ')
}

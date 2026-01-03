import { words } from './words'

/**
 * Convert string to uppercase
 *
 * 将字符串转换为大写
 *
 * @category String
 * @example
 * ```ts
 * upperCase('Hello World') // => 'HELLO WORLD'
 * upperCase('hello world') // => 'HELLO WORLD'
 * upperCase('order-by') // => 'ORDER BY'
 * ```
 */
export function upperCase(str: string): string {
  if (!str)
    return ''

  const parts = words(str)

  if (parts.length === 0)
    return ''

  return parts.map(word => word.toUpperCase()).join(' ')
}

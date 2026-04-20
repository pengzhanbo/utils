import { capitalize } from './capitalize'
import { words } from './words'

/**
 * Converts a string to Title Case (first letter of each word capitalized)
 *
 * 将字符串转换为 Title Case（每个单词的首字母大写）
 *
 * @category String
 *
 * @param str - The string to convert. 要转换的字符串
 * @returns The string in Title Case. Title Case 格式的字符串
 *
 * @example
 * ```ts
 * titleCase('hello world') // => 'Hello World'
 * titleCase('foo-bar') // => 'Foo Bar'
 * titleCase('fooBarBaz') // => 'Foo Bar Baz'
 * ```
 */
export function titleCase(str: string): string {
  if (!str) return ''

  return words(str)
    .map((word) => capitalize(word))
    .join(' ')
}

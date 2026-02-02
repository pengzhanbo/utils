import { capitalize } from './capitalize'
import { words } from './words'

/**
 * Converts a string to Pascal case
 *
 * 将字符串转换为大驼峰命名法
 *
 * @category String
 * @example
 * ```ts
 * pascalCase('foo bar') // => FooBar
 * pascalCase('foo-bar') // => FooBar
 * ```
 */
export function pascalCase(str: string): string {
  if (!str) return ''

  const parts = words(str)

  if (parts.length === 0) return ''

  return parts.map((word) => capitalize(word)).join('')
}

import { capitalize } from './capitalize'
import { words } from './words'

/**
 * Convert string to camelCase
 *
 * 将字符串转换为驼峰命名法
 *
 * @category String
 *
 * @example
 * ```ts
 * camelCase('foo bar') // => fooBar
 * camelCase('foo-bar') // => fooBar
 * ```
 */
export function camelCase(str: string): string {
  if (!str)
    return ''

  const parts = words(str)

  if (parts.length === 0)
    return ''

  const [first, ...rest] = parts

  return `${first!.toLowerCase()}${rest.map(word => capitalize(word)).join('')}`
}

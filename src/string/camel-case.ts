import { capitalize } from './capitalize'
import { words } from './words'

/**
 * Convert string to camelCase
 *
 * 将字符串转换为驼峰命名法
 *
 * @category String
 *
 * @param str - The string to convert. 要转换的字符串
 * @returns The string in camelCase. 驼峰命名法格式的字符串
 *
 * @see {@link pascalCase}, {@link snakeCase}, {@link kebabCase}, {@link constantCase} — for other case conversions
 * @see {@link pascalCase}、{@link snakeCase}、{@link kebabCase}、{@link constantCase} — 其他大小写转换
 *
 * @example
 * ```ts
 * camelCase('foo bar') // => fooBar
 * camelCase('foo-bar') // => fooBar
 * ```
 */
export function camelCase(str: string): string {
  if (!str) return ''

  const parts = words(str)

  if (parts.length === 0) return ''

  const [first, ...rest] = parts

  return `${first!.toLowerCase()}${rest.map((word) => capitalize(word)).join('')}`
}

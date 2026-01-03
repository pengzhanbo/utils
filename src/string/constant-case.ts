import { words } from './words'

/**
 * Converts a string to constant case
 *
 * 将字符串转换为常量命名法
 *
 * @category String
 * @example
 * ```ts
 * constantCase('foo bar') // => FOO_BAR
 * constantCase('foo-bar') // => FOO_BAR
 * ```
 */
export function constantCase(str: string): string {
  if (!str)
    return ''

  const parts = words(str)

  if (parts.length === 0)
    return ''

  return parts.map(word => word.toUpperCase()).join('_')
}

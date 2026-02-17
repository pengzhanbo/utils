import { words } from './words'

/**
 * Convert string to snake_case
 *
 * 将字符串转换为蛇形命名法
 *
 * @category String
 *
 * @param str - 要转换的字符串
 * @returns 转换后的蛇形命名法字符串
 *
 * @example
 * ```ts
 * snakeCase('a b c') // => a_b_c
 * snakeCase('orderBy') // => order_by
 * ```
 */
export function snakeCase(str: string): string {
  if (!str) return ''

  const parts = words(str)

  if (parts.length === 0) return ''

  return parts.map((word) => word.toLowerCase()).join('_')
}

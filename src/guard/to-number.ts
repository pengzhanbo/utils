import { isSymbol } from '../predicate'

/**
 * Converts a value to a number
 *
 * 将值转换为数字
 *
 * @category Guard
 *
 * @param v - The value to convert. 要转换的值
 * @returns The converted number, or NaN if conversion is not possible. 转换后的数字，如果无法转换则返回 NaN
 *
 * @example
 * ```ts
 * toNumber('42') // => 42
 * toNumber('hello') // => NaN
 * toNumber(undefined) // => NaN
 * ```
 */
export function toNumber(v: unknown): number {
  return isSymbol(v) ? Number.NaN : Number(v)
}

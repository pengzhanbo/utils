import type { Finite } from '../types/numeric'
import { toNumber } from './to-number'

/**
 * Converts a value to a finite number
 *
 * 将值转换为有限数字
 *
 * @category Guard
 *
 * @param v - The value to convert. 要转换的值
 * @returns The converted finite number, or NaN if conversion is not possible or result is not finite. 转换后的有限数字，如果无法转换或结果不是有限数字则返回 NaN
 *
 * @example
 * ```ts
 * toFinite(42) // => 42
 * toFinite(Infinity) // => NaN
 * toFinite('hello') // => NaN
 * ```
 */
export function toFinite(v: unknown): number {
  const num = toNumber(v)
  return Number.isFinite(num) ? (num as Finite<number>) : Number.NaN
}

import { isNumber } from '../predicate/is-number.js'
import { isSymbol } from '../predicate/is-symbol.js'

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
 * @remarks
 * Symbols are specially handled: `Number(Symbol())` would throw a `TypeError`, so this function returns `NaN` for symbols instead.
 *
 * Symbol 被特殊处理：`Number(Symbol())` 会抛出 `TypeError`，因此此函数对 Symbol 返回 `NaN`。
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

/**
 * 尝试将值转换为数字
 *
 * 尝试将值转换为数字，如果无法转换则返回 NaN
 *
 * @category Guard
 *
 * @param v - The value to convert. 要转换的值
 * @returns The converted number, or NaN if conversion is not possible. 转换后的数字，如果无法转换则返回 NaN
 *
 * @example
 * ```ts
 * tryToNumber('42') // => 42
 * tryToNumber('42.0') // => 42
 * tryToNumber('42abc') // => 42
 * tryToNumber('0x2A') // => 42
 * tryToNumber('hello') // => NaN
 * tryToNumber(undefined) // => NaN
 * tryToNumber('abc123') // => NaN
 * ```
 */
export function tryToNumber(v: unknown): number {
  if (isSymbol(v)) {
    return Number.NaN
  }
  const num = Number(v)
  return isNumber(num) && !Number.isNaN(num) ? num : Number.parseFloat(v as string)
}

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

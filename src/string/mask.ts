/**
 * Options for the mask function.
 *
 * mask 函数的选项。
 */
export interface MaskOptions {
  /**
   * The index at which masking starts (inclusive). Default is 3.
   * 掩码开始位置（包含），默认为 3
   */
  start?: number
  /**
   * The index at which masking ends (exclusive). A negative value counts
   * from the end of the string. Default is -4.
   * 掩码结束位置（不包含），负数表示从字符串末尾计数，默认为 -4
   */
  end?: number
  /**
   * The character used to mask the string. Default is '*'.
   * 用于掩码的字符，默认为 '*'
   */
  maskChar?: string
}

/**
 * Masks a portion of a string, replacing the masked characters with a mask character.
 *
 * 将字符串的指定部分替换为掩码字符，用于隐藏敏感信息。
 *
 * @category String
 *
 * @param value - The string to mask. 要掩码的字符串
 * @param options - The masking options. 掩码选项
 * @returns The masked string. 掩码后的字符串
 *
 * @remarks
 * Indices are UTF-16 code units; a negative `end` counts from the end of the string.
 * Non-finite `start`/`end` values resolve to 0 and `value.length` respectively.
 *
 * 索引按 UTF-16 码元计算；`end` 为负数时从字符串末尾开始计数。
 * 非有限的 `start`/`end` 值分别解析为 0 和 `value.length`。
 *
 * @example
 * ```ts
 * mask('13800138000') // => '138****8000'
 * ```
 *
 * @example
 * ```ts
 * mask('user@example.com', { start: 1, end: 4 }) // => 'u***@example.com'
 * ```
 *
 * @example
 * ```ts
 * mask('12345678', { start: 2, end: -2 }) // => '12****78'
 * ```
 */
export function mask(value: string, options: MaskOptions = {}): string {
  const { start = 3, end = -4, maskChar = '*' } = options
  const s = Math.max(Number.isFinite(start) ? Math.trunc(start) : 0, 0)
  let v = Number.isFinite(end) ? Math.trunc(end) : value.length
  if (v < 0) {
    v = value.length + v
  }
  v = Math.min(v, value.length)
  if (s >= v || s >= value.length) {
    return value
  }
  return value.slice(0, s) + maskChar.repeat(v - s) + value.slice(v)
}

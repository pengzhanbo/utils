import { assertFiniteNonNegativeNumber } from '../_internal/assert.js'

const DECIMAL_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const
const BINARY_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'] as const

export interface FormatBytesOptions {
  /** Number of decimal places to keep. Defaults to `1`. 保留的小数位数。默认为 `1` */
  precision?: number
  /** Whether to use binary units (1024 base) instead of decimal units (1000 base). Defaults to `false`. 是否使用二进制单位（以 1024 为基数）而非十进制单位（以 1000 为基数）。默认为 `false` */
  binary?: boolean
  /** Whether to include whitespace between the number and the unit. Defaults to `false`. 是否保留数字与单位之间的空格。默认为 `false` */
  whitespace?: boolean
}

/**
 * Formats a number of bytes into a human-readable string.
 *
 * Uses decimal units (1000 base, e.g. KB, MB) by default, or binary units
 * (1024 base, e.g. KiB, MiB) when `binary` is true. Values below the base
 * are returned as-is with the `B` unit and no decimal places.
 *
 * 将字节数格式化为人类可读的字符串。
 *
 * 默认使用十进制单位（以 1000 为基数，如 KB、MB）；当 `binary` 为 true 时使用
 * 二进制单位（以 1024 为基数，如 KiB、MiB）。小于基数的值原样返回并附带 `B` 单位，
 * 不保留小数位。
 *
 * @category Util
 *
 * @param bytes - The number of bytes to format. 要格式化的字节数
 * @param options - Formatting options. 格式化选项
 * @param options.precision - Number of decimal places to keep. Defaults to `1`. 保留的小数位数。默认为 `1`
 * @param options.binary - Whether to use binary units (1024 base) instead of decimal units (1000 base). Defaults to `false`. 是否使用二进制单位（以 1024 为基数）而非十进制单位（以 1000 为基数）。默认为 `false`
 *
 * @returns The formatted string. 格式化后的字符串
 *
 * @throws {RangeError} If `bytes` is negative, NaN, or Infinity. 当 `bytes` 为负数、NaN 或 Infinity 时抛出。
 *
 * @remarks
 * Values at or above the base keep `precision` decimal places and are
 * clamped to the largest available unit (PB / PiB).
 *
 * 不小于基数的值保留 `precision` 位小数，并停留在最大单位（PB / PiB）。
 *
 * @example
 * ```ts
 * formatBytes(500) // => '500B'
 * ```
 *
 * @example
 * ```ts
 * formatBytes(1572864) // => '1.6MB'
 * formatBytes(1572864, { binary: true }) // => '1.5MiB'
 * formatBytes(1536, { precision: 2 }) // => '1.54KB'
 * formatBytes(1572864, { whitespace: true }) // => '1.6 MB'
 * ```
 */
export function formatBytes(bytes: number, options: FormatBytesOptions = {}): string {
  assertFiniteNonNegativeNumber(bytes, 'bytes')

  const { precision = 1, binary = false, whitespace = false } = options
  const base = binary ? 1024 : 1000
  const units = binary ? BINARY_UNITS : DECIMAL_UNITS
  const space = whitespace ? ' ' : ''

  if (bytes < base) {
    return `${bytes}${space}B`
  }

  let value = bytes
  let unitIndex = 0
  while (value >= base && unitIndex < units.length - 1) {
    value /= base
    unitIndex++
  }

  return `${value.toFixed(precision)}${space}${units[unitIndex]!}`
}

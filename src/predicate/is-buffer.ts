import { T_UNDEFINED } from '../_internal/tags'

declare let Buffer: undefined | typeof globalThis.Buffer

/**
 * Checks if the input is a Buffer.
 *
 * 检查输入是否为 Buffer。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is a Buffer, false otherwise. 如果值为 Buffer 则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isBuffer(Buffer.from('hello')) // => true
 * ```
 */
export function isBuffer(v: unknown): v is Buffer {
  /* istanbul ignore next -- @preserve */
  // eslint-disable-next-line valid-typeof
  return typeof Buffer !== T_UNDEFINED && Buffer!.isBuffer(v)
}

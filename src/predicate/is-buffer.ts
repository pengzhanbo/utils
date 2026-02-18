import { T_UNDEFINED } from '../_internal/tags'

declare let Buffer: undefined | typeof globalThis.Buffer

/**
 * Checks if the input is a buffer
 *
 * 检查输入是否为Buffer
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a buffer, false otherwise. 如果值为Buffer则返回true，否则返回false
 */
export function isBuffer(v: unknown): boolean {
  /* istanbul ignore next -- @preserve */
  // eslint-disable-next-line valid-typeof
  return typeof Buffer !== T_UNDEFINED && Buffer!.isBuffer(v)
}

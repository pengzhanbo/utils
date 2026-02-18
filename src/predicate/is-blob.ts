import { T_UNDEFINED } from '../_internal/tags'

/**
 * Checks if the input is a blob
 *
 * 检查输入是否为Blob
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a blob, false otherwise. 如果值为Blob则返回true，否则返回false
 */
export function isBlob(v: unknown): v is Blob {
  /* istanbul ignore if -- @preserve */
  // eslint-disable-next-line valid-typeof
  if (typeof Blob === T_UNDEFINED) return false

  return v instanceof Blob
}

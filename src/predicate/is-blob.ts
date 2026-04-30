import { T_BLOB, T_UNDEFINED } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is a Blob.
 *
 * 检查输入是否为 Blob。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is a Blob, false otherwise. 如果值为 Blob 则返回 true，否则返回 false
 *
 * @remarks
 * This function first checks whether the global `Blob` constructor is defined before using `instanceof Blob`.
 * This prevents `ReferenceError` in non-browser environments (e.g., Node.js) where `Blob` may not exist.
 *
 * 该函数在使用 `instanceof Blob` 之前，首先检查全局 `Blob` 构造函数是否已定义。
 * 这可以防止在 `Blob` 不存在的非浏览器环境（如 Node.js）中抛出 `ReferenceError`。
 *
 * @example
 * ```ts
 * isBlob(new Blob([])) // => true
 * isBlob({}) // => false
 * ```
 */
export function isBlob(v: unknown): v is Blob {
  /* istanbul ignore if -- @preserve */
  // eslint-disable-next-line valid-typeof
  if (typeof Blob === T_UNDEFINED) return false

  return isTypeof(v, T_BLOB)
}

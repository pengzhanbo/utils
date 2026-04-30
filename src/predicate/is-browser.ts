import { T_UNDEFINED } from '../_internal/tags'

/**
 * Checks if the current runtime is a browser environment.
 *
 * 检查当前运行时是否为浏览器环境。
 *
 * @category Predicate
 *
 * @returns True if in a browser environment, false otherwise. 如果在浏览器环境中则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * // Returns a boolean, runtime-dependent
 * isBrowser() // => true | false
 * ```
 */
export function isBrowser(): boolean {
  /* istanbul ignore next -- @preserve */
  // eslint-disable-next-line valid-typeof
  return typeof window !== T_UNDEFINED && window.document != null
}

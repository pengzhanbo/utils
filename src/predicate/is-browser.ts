import { T_UNDEFINED } from '../_internal/tags'

/**
 * Checks if the input is a browser
 *
 * 检查是否在浏览器环境中
 *
 * @category Predicate
 *
 * @returns True if in a browser environment, false otherwise. 如果在浏览器环境中则返回true，否则返回false
 */
export function isBrowser(): boolean {
  /* istanbul ignore next -- @preserve */
  // eslint-disable-next-line valid-typeof
  return typeof window !== T_UNDEFINED && window.document != null
}

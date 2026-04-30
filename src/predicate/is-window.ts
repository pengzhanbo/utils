import { T_UNDEFINED } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the current runtime is a window environment.
 *
 * 检查当前运行时是否为浏览器窗口环境。
 *
 * @category Predicate
 *
 * @returns True if in a window environment, false otherwise. 如果在窗口环境中则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * // Returns a boolean, runtime-dependent
 * isWindow() // => true | false
 * ```
 */
export function isWindow(): boolean {
  /* istanbul ignore next -- @preserve */
  // eslint-disable-next-line valid-typeof
  return typeof window !== T_UNDEFINED && isTypeof(window, 'window')
}

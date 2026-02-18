import { T_UNDEFINED } from '../_internal/tags'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is a window
 *
 * 检查是否在浏览器窗口环境中
 *
 * @category Predicate
 *
 * @returns True if in a window environment, false otherwise. 如果在窗口环境中则返回true，否则返回false
 */
export function isWindow(): boolean {
  /* istanbul ignore next -- @preserve */
  // eslint-disable-next-line valid-typeof
  return typeof window !== T_UNDEFINED && isTypeof(window, 'window')
}

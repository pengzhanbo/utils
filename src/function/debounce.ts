import type { Cancel, FnNoReturn } from '../_internal/types'
import { throttle } from './throttle'

/**
 * Debounce Options
 * @category Types
 */
export interface DebounceOptions {
  /**
   * If atBegin is false or unspecified, callback will only be executed `delay`
   * milliseconds after the last debounced-function call. If atBegin is true,
   * callback will be executed only at the first debounced-function call. (After
   * the throttled-function has not been called for `delay` milliseconds, the
   * internal counter is reset).
   *
   * 如果atBegin为false或未指定，回调函数仅在最后一次防抖函数调用后的`delay`毫秒执行。
   * 如果atBegin为true，回调函数仅在第一次防抖函数调用时执行。
   * （在节流函数未被调用`delay`毫秒后，内部计数器将被重置）。
   */
  atBegin?: boolean
}

/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * 防抖函数的执行。与节流不同，防抖确保一个函数在一系列调用中仅执行一次，
 * 要么在调用的最开始，要么在调用的最末尾。
 *
 * @category Function
 *
 * @param delay - A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful. 一个零或更大的延迟，以毫秒为单位。对于事件回调，大约100或250（甚至更高）的值最为实用。
 * @param callback - A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is, to `callback` when the debounced-function is executed. 一个在延迟毫秒后执行的函数。当防抖函数执行时，`this`上下文和所有参数都会原样传递给`callback`。
 * @param options - An object to configure options. 用于配置选项的对象。
 * @returns A new, debounced function. 新的防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  delay: number,
  callback: T,
  options?: DebounceOptions,
): FnNoReturn<T> & Cancel {
  const { atBegin = false } = options || {}
  return throttle(delay, callback, { debounceMode: atBegin !== false })
}

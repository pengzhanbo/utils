import type { Cancel, FnNoReturn } from '../_internal/types'
import { throttle } from './throttle'

/**
 * Debounce Options
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
 * @param delay
 * A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 *
 * 一个零或更大的延迟，以毫秒为单位。对于事件回调，大约100或250（甚至更高）的值最为实用。
 *
 * @param callback
 * A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is, to `callback` when the debounced-function is executed.
 *
 * 一个在延迟毫秒后执行的函数。当防抖函数执行时，`this`上下文和所有参数都会原样传递给`callback`。
 *
 * @param options - An object to configure options. 用于配置选项的对象。
 * @param options.atBegin - If true, the callback is executed at the beginning of the delay period instead of the end. 如果为 true，回调在延迟期开始时而非结束时执行。
 * @returns A debounced version of the callback with a `.cancel()` method. 带有 `.cancel()` 方法的防抖版本回调函数。
 *
 * @remarks
 * Internally delegates to {@link throttle} with `debounceMode` set. The returned function
 * includes a `cancel(options?: CancelOptions)` method to cancel pending executions.
 *
 * 内部委托给设置了 `debounceMode` 的 {@link throttle}。返回的函数包含 `cancel(options?: CancelOptions)` 方法用于取消待执行的调用。
 *
 * @see {@link throttle} — for throttle behavior (debounce delegates to throttle internally)
 * @see {@link throttle} — 了解节流行为（debounce 内部委托给 throttle）
 *
 * @example
 * Basic debounce — input handler that fires 250ms after the last keystroke:
 * ```ts
 * const onInput = debounce(250, (value: string) => {
 *   console.log('Search:', value)
 * })
 * // Each call resets the timer; callback runs only after 250ms of inactivity
 * onInput('a')
 * onInput('ab')
 * onInput('abc') // Only this triggers the callback after 250ms
 * ```
 *
 * @example
 * atBegin mode — fires immediately on the first call, then ignores subsequent calls:
 * ```ts
 * const onClick = debounce(1000, () => console.log('clicked'), { atBegin: true })
 * onClick() // => 'clicked' (immediately)
 * onClick() // ignored (within delay)
 * onClick() // ignored (within delay)
 * ```
 *
 * @example
 * Cancel a pending execution:
 * ```ts
 * const fn = debounce(500, () => console.log('done'))
 * fn()
 * fn.cancel() // The scheduled execution is cancelled
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  delay: number,
  callback: T,
  options?: DebounceOptions,
): FnNoReturn<T> & Cancel {
  if (!Number.isFinite(delay) || delay < 0)
    throw new RangeError('delay must be a finite non-negative number')
  const { atBegin = false } = options || {}
  return throttle(delay, callback, { debounceMode: atBegin })
}

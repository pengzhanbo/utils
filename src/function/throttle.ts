import type { Cancel, CancelOptions, FnNoReturn } from '../_internal/types'

/**
 * Throttle Options
 * @category Types
 */
export interface ThrottleOptions {
  /**
   * Optional, defaults to false. If noTrailing is true, callback will only execute
   * every `delay` milliseconds while the throttled-function is being called. If
   * noTrailing is false or unspecified, callback will be executed one final time
   * after the last throttled-function call. (After the throttled-function has not
   * been called for `delay` milliseconds, the internal counter is reset)
   *
   * 可选，默认为false。如果noTrailing为true，回调函数仅在节流函数被调用时每`delay`毫秒执行一次。
   * 如果noTrailing为false或未指定，回调函数将在最后一次节流函数调用后额外执行一次。
   * （当节流函数在`delay`毫秒内未被调用时，内部计数器将被重置）
   */
  noTrailing?: boolean
  /**
   * Optional, defaults to false. If noLeading is false, the first throttled-function
   * call will execute callback immediately. If noLeading is true, the first the
   * callback execution will be skipped. It should be noted that callback will never
   * executed if both noLeading = true and noTrailing = true.
   *
   * 可选，默认为false。如果noLeading为false，第一次节流函数调用将立即执行回调。
   * 如果noLeading为true，第一次回调执行将被跳过。
   * 需要注意的是，如果noLeading = true且noTrailing = true，回调将永远不会被执行。
   */
  noLeading?: boolean
  /**
   * If `debounceMode` is true (at begin), schedule
   * `callback` to execute after `delay` ms. If `debounceMode` is false (at end),
   * schedule `callback` to execute after `delay` ms.
   *
   * 如果 `debounceMode` 为 true（在开始时），则安排
   * `callback` 在 `delay` 毫秒后执行。如果 `debounceMode` 为 false（在结束时），
   * 安排 `callback` 在 `delay` 毫秒后执行。
   */
  debounceMode?: boolean
}

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * 限制函数的执行频率。特别适用于限制事件处理程序的执行速率，例如调整大小和滚动事件。
 *
 * @category Function
 *
 * @param delay
 * A zero-or-greater delay in milliseconds. For event callbacks, values around
 * 100 or 250 (or even higher) are most useful.
 *
 * 一个零或更大的延迟时间，以毫秒为单位。对于事件回调，大约
 * 100或250（甚至更高）的值最为实用。
 *
 * @param callback
 * A function to be executed after delay milliseconds. The `this` context and
 * all arguments are passed through, as-is, to `callback` when the
 * throttled-function is executed.
 *
 * 一个在延迟毫秒后执行的函数。
 * 当节流函数执行时，`this`上下文和所有参数都会原样传递给`callback`。
 *
 * @param options
 * An object to configure options.
 * 用于配置选项的对象。
 *
 * @return A new throttled function.
 */
export function throttle<T extends (...args: any[]) => any>(
  delay: number,
  callback: T,
  options?: ThrottleOptions,
): FnNoReturn<T> & Cancel {
  const { noTrailing = false, noLeading = false, debounceMode = undefined } = options || {}
  /**
   * After wrapper has stopped being called, this timeout ensures that
   * `callback` is executed at the proper times in `throttle` and `end`
   * debounce modes.
   *
   * 在包装器停止调用后，此超时确保
   * 在节流和结束模式中，`callback` 在适当的时间执行
   * 防抖模式。
   */
  let timeoutID: NodeJS.Timeout | undefined
  let cancelled = false

  // Keep track of the last time `callback` was executed.
  let lastExec = 0

  // Function to clear existing timeout
  function clearExistingTimeout() {
    if (timeoutID) clearTimeout(timeoutID)
  }

  // Function to cancel next exec
  function cancel(options: CancelOptions = {}) {
    const { upcomingOnly = false } = options || {}
    clearExistingTimeout()
    cancelled = !upcomingOnly
  }

  /**
   * The `wrapper` function encapsulates all of the throttling / debouncing
   * functionality and when executed will limit the rate at which `callback`
   * is executed.
   *
   * `wrapper`函数封装了所有的节流/防抖功能，执行时将限制`callback`的回调执行频率。
   */
  function wrapper(this: any, ...args: Parameters<T>) {
    const self = this as any
    const elapsed = Date.now() - lastExec

    if (cancelled) return

    // Execute `callback` and update the `lastExec` timestamp.
    function exec() {
      lastExec = Date.now()
      callback.apply(self, args)
    }

    /**
     * If `debounceMode` is true (at begin) this is used to clear the flag
     * to allow future `callback` executions.
     *
     * 如果`debounceMode`为真（在开始时），这用于清除标志
     * 以允许未来的`callback`执行。
     */
    function clear() {
      timeoutID = undefined
    }

    if (!noLeading && debounceMode && !timeoutID) {
      /**
       * Since `wrapper` is being called for the first time and
       * `debounceMode` is true (at begin), execute `callback`
       * and noLeading != true.
       *
       * 由于`wrapper`是首次被调用，且 `debounceMode`为真（在开始时），
       * 执行 `callback` 且`noLeading`不为真。
       */
      exec()
    }

    clearExistingTimeout()

    if (debounceMode === undefined && elapsed > delay) {
      if (noLeading) {
        /**
         * In throttle mode with noLeading, if `delay` time has
         * been exceeded, update `lastExec` and schedule `callback`
         * to execute after `delay` ms.
         *
         * 在无前导的节流模式下，若`delay`时间已超过：
         * 更新`lastExec`并安排`callback`
         * 在`delay`毫秒后执行。
         */
        lastExec = Date.now()
        if (!noTrailing) timeoutID = setTimeout(debounceMode ? clear : exec, delay)
      } else {
        /**
         * In throttle mode without noLeading, if `delay` time has been exceeded, execute
         * `callback`.
         *
         * 在无前导的节流模式下，若已超过`delay`时间，则执行 `callback`。
         */
        exec()
      }
    } else if (noTrailing !== true) {
      /**
       * In trailing throttle mode, since `delay` time has not been
       * exceeded, schedule `callback` to execute `delay` ms after most
       * recent execution.
       *
       * If `debounceMode` is true (at begin), schedule `clear` to execute
       * after `delay` ms.
       *
       * If `debounceMode` is false (at end), schedule `callback` to
       * execute after `delay` ms.
       *
       * 在节流模式中，由于`delay`时间尚未超过，安排`callback`在最近一次执行后的`delay`毫秒执行。
       *
       * 如果`debounceMode`为true（在开始时），安排`clear`在`delay`毫秒后执行。
       *
       * 如果`debounceMode`为false（在结束时），安排`callback`在 `delay`毫秒后执行。
       */
      timeoutID = setTimeout(
        debounceMode ? clear : exec,
        debounceMode === undefined ? delay - elapsed : delay,
      )
    }
  }

  wrapper.cancel = cancel

  // Return the wrapper function.
  return wrapper
}

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
   */
  noTrailing?: boolean
  /**
   * Optional, defaults to false. If noLeading is false, the first throttled-function
   * call will execute callback immediately. If noLeading is true, the first the
   * callback execution will be skipped. It should be noted that callback will never
   * executed if both noLeading = true and noTrailing = true.
   */
  noLeading?: boolean
  /**
   * If `debounceMode` is true (at begin), schedule
   * `callback` to execute after `delay` ms. If `debounceMode` is false (at end),
   * schedule `callback` to execute after `delay` ms.
   */
  debounceMode?: boolean
}

interface CancelOptions {
  upcomingOnly?: boolean
}

interface Cancel {
  cancel: (options?: CancelOptions) => void
}

interface NoReturn<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
}

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @category Function
 *
 * @param delay
 * A zero-or-greater delay in milliseconds. For event callbacks, values around
 * 100 or 250 (or even higher) are most useful.
 *
 * @param callback
 * A function to be executed after delay milliseconds. The `this` context and
 * all arguments are passed through, as-is, to `callback` when the
 * throttled-function is executed.
 *
 * @param options
 * An object to configure options.
 *
 * @return
 * A new, throttled, function.
 */
export function throttle<T extends (...args: any[]) => any>(
  delay: number,
  callback: T,
  options?: ThrottleOptions,
): NoReturn<T> & Cancel {
  const {
    noTrailing = false,
    noLeading = false,
    debounceMode = undefined,
  } = options || {}
  /**
   * After wrapper has stopped being called, this timeout ensures that
   * `callback` is executed at the proper times in `throttle` and `end`
   * debounce modes.
   */
  let timeoutID: NodeJS.Timeout | undefined
  let cancelled = false

  // Keep track of the last time `callback` was executed.
  let lastExec = 0

  // Function to clear existing timeout
  function clearExistingTimeout() {
    if (timeoutID)
      clearTimeout(timeoutID)
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
   */
  function wrapper(this: any, ...args: Parameters<T>) {
    const self = this as any
    const elapsed = Date.now() - lastExec

    if (cancelled)
      return

    // Execute `callback` and update the `lastExec` timestamp.
    function exec() {
      lastExec = Date.now()
      callback.apply(self, args)
    }

    /**
     * If `debounceMode` is true (at begin) this is used to clear the flag
     * to allow future `callback` executions.
     */
    function clear() {
      timeoutID = undefined
    }

    if (!noLeading && debounceMode && !timeoutID) {
      /**
       * Since `wrapper` is being called for the first time and
       * `debounceMode` is true (at begin), execute `callback`
       * and noLeading != true.
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
         */
        lastExec = Date.now()
        if (!noTrailing)
          timeoutID = setTimeout(debounceMode ? clear : exec, delay)
      }
      else {
        /**
         * In throttle mode without noLeading, if `delay` time has been exceeded, execute
         * `callback`.
         */
        exec()
      }
    }
    else if (noTrailing !== true) {
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
   */
  atBegin?: boolean
}

/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @category Functions
 *
 * @param delay
 * A zero-or-greater delay in milliseconds. For event callbacks, values around
 * 100 or 250 (or even higher) are most useful.
 *
 * @param callback
 * A function to be executed after delay milliseconds. The `this` context and
 * all arguments are passed through, as-is, to `callback` when the
 * debounced-function is executed.
 *
 * @param options
 * An object to configure options.
 *
 * @return
 * A new, debounced function.
 */
export function debounce<T extends (...args: any[]) => any>(
  delay: number,
  callback: T,
  options?: DebounceOptions,
): NoReturn<T> & Cancel {
  const { atBegin = false } = options || {}
  return throttle(delay, callback, { debounceMode: atBegin !== false })
}

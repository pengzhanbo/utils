/**
 * Wrap a promise as a singleton, returning the same promise on multiple calls.
 *
 * Through the `singleton.reset()` method, you can reset the currently expired promise and wait for it to close normally.
 *
 * 将一个 promise 包装为单例，在多次调用时，返回同一个 promise
 *
 * 通过 `singleton.reset` 方法可以重置当前过期的 promise，并等待其正常关闭
 *
 * @category Promise
 *
 * @param fn - the function that returns the promise to wrap - 要包装的 promise 返回函数
 * @returns a function that returns the wrapped promise
 *          - 返回包装后的 promise
 * @example
 * ```ts
 * let i = 1
 * const singleton = createSingletonPromise(() => Promise.resolve(i++))
 * const p1 = singleton()
 * const p2 = singleton()
 * console.log(p1 === p2) // true
 *
 * await p1() // will log: 2
 * await p2() // will log: 2
 * ```
 *
 * @example
 * ```ts
 * let i = 0
 * const singleton = createSingletonPromise(() => Promise.resolve(i++))
 *
 * await singleton() // will log: 1
 * await singleton.reset() // reset the promise, and await it to have proper shutdown
 * await singleton() // will log: 2
 * ```
 */
export function createSingletonPromise<T>(fn: () => Promise<T>): SingletonPromise<T> {
  let _promise: Promise<T> | undefined

  function wrapper() {
    if (!_promise) _promise = fn()
    return _promise
  }
  wrapper.reset = async () => {
    const _prev = _promise
    _promise = undefined
    if (_prev) await _prev
  }

  return wrapper
}

export interface SingletonPromise<T> {
  (): Promise<T>
  /**
   * Reset current staled promise.
   * Await it to have proper shutdown.
   *
   * 重置当前过期的 promise。
   * 并等待其正常关闭。
   */
  reset: () => Promise<void>
}

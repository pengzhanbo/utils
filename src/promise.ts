/**
 * Promise Helpers
 *
 * @module Promise
 */

import type { Fn } from './types'
import { remove } from './array'
import { isFunction } from './is'

/**
 * Sleeps for the given number of milliseconds.
 *
 * 给定毫秒数睡眠。
 * @param ms - the number of milliseconds to sleep. 睡眠的毫秒数
 * @param callback - (optional) the function to execute after the sleep. 睡眠完成后执行的函数。
 * @returns a promise
 */
export async function sleep(ms: number, callback?: Fn<any>): Promise<void> {
  return new Promise<void>(resolve =>
    setTimeout(async () => {
      await callback?.()
      resolve()
    }, ms),
  )
}

/**
 * Executes an array of promises in parallel with a given concurrency. The function
 * returns a Promise that resolves with an array containing the resolved values of
 * each promise.
 * If any promise is rejected, the returned promise will be rejected.
 *
 * 以指定的并发数并行执行一组 promise。该函数返回一个 promise，该承诺解析为一个数组，包含每个 promise 的解析值。
 * 任意一个 promise 拒绝，返回的 promise 将被拒绝。
 *
 * @category Promise
 *
 * @param promises - the array of promises to execute
 * @param concurrency - (optional) the maximum number of promises to execute in parallel 最大并发数
 */
export function promiseParallel(
  promises: (PromiseLike<any> | (() => PromiseLike<any>))[],
  concurrency = Number.POSITIVE_INFINITY,
): Promise<any[]> {
  promises = Array.from(promises)
  let current = 0
  const result: any[] = []
  let resolvedCount = 0
  const len = promises.length
  return new Promise((resolve, reject) => {
    function next() {
      const index = current++
      const promise = promises[index]
      Promise.resolve(isFunction(promise) ? promise() : promise)
        .then((res) => {
          result[index] = res
          if (++resolvedCount === len)
            resolve(result)

          if (current < len)
            next()
        })
        .catch(reason => reject(reason))
    }
    for (let i = 0; i < concurrency && i < len; i++) next()
  })
}

/**
 * Creates a promise that is resolved with an array of promise settlement results,
 * in the same order as the input promises array.
 * The returned promise will be fulfilled when all of the input promises have settled,
 * either fulfilled or rejected.
 *
 * 创建一个以输入 promise 数组的结果数组解决的 promise，
 * 按照输入 promise 数组的相同顺序。
 * 当所有输入 promise 都已解决时，返回的 promise将被实现，
 * 要么实现，要么拒绝。
 *
 * @category Promise
 *
 * @param promises - the array of promises to execute
 * @param concurrency - (optional) the maximum number of promises to execute in parallel
 */
export function promiseParallelSettled(
  promises: (PromiseLike<any> | (() => PromiseLike<any>))[],
  concurrency = Number.POSITIVE_INFINITY,
): Promise<PromiseSettledResult<any>[]> {
  promises = Array.from(promises)
  let current = 0
  const result: PromiseSettledResult<any>[] = []
  let resolvedCount = 0
  const len = promises.length
  return new Promise((resolve) => {
    function resolved() {
      if (++resolvedCount === len)
        resolve(result)

      if (current < len)
        next()
    }
    function next() {
      const index = current++
      const promise = promises[index]
      Promise.resolve(isFunction(promise) ? promise() : promise)
        .then((value) => {
          result[index] = { status: 'fulfilled', value }
          resolved()
        })
        .catch((reason) => {
          result[index] = { status: 'rejected', reason }
          resolved()
        })
    }
    for (let i = 0; i < concurrency && i < len; i++) next()
  })
}

/**
 * An error class representing an timeout operation.
 * @category Promise
 * @augments Error
 */
export class TimeoutError extends Error {
  constructor(message = 'The operation was timed out') {
    super(message)
    this.name = 'TimeoutError'
  }
}

/**
 * Returns a promise that rejects with a `TimeoutError` after a specified delay.
 *
 * 返回一个 promise，该 promise 在指定的延迟时间后拒绝，抛出一个 `TimeoutError`。
 *
 * @category Promise
 * @param ms - the number of milliseconds to wait before rejecting the promise. 超时的毫秒数
 * @throws Throws a `TimeoutError` after the specified delay.
 * @example
 * ```ts
 * @example
 * ```
 * try {
 *   await timeout(1000); // Timeout exception after 1 second
 * } catch (error) {
 *   console.error(error); // Will log 'The operation was timed out'
 * }
 * ```
 */
export async function timeout(ms: number): Promise<never> {
  await sleep(ms)
  throw new TimeoutError()
}

/**
 * Executes an async function and enforces a timeout.
 *
 * 执行异步函数, 超时则强制拒绝
 *
 * @category Promise
 * @param run - the async function to execute.
 * @param ms - the number of milliseconds to wait before rejecting the promise.
 * @returns A promise that resolves with the result of the async function, or rejects with a `TimeoutError` if the function does not resolve within the specified timeout. 一个 promise，它将解析为异步函数的结果，或者如果在指定超时内函数未解析，则拒绝并抛出`TimeoutError`。
 * @example
 * ```ts
 * async function fetchData() {
 *   const response = await fetch('https://example.com/data');
 *   return response.json();
 * }
 *
 * try {
 *   const data = await withTimeout(fetchData, 1000);
 *   console.log(data); // Logs the fetched data if `fetchData` is resolved within 1 second.
 * } catch (error) {
 *   console.error(error); // Will log 'TimeoutError' if `fetchData` is not resolved within 1 second.
 * }
 * ```
 */
export async function withTimeout<T>(run: () => Promise<T>, ms: number): Promise<T> {
  return Promise.race([run(), timeout(ms)])
}

export interface SingletonPromiseReturn<T> {
  (): Promise<T>
  /**
   * Reset current staled promise.
   * Await it to have proper shutdown.
   */
  reset: () => Promise<void>
}

/**
 * Create singleton promise function
 *
 * 创建单例 promise
 *
 * @category Promise
 */
export function createSingletonPromise<T>(fn: () => Promise<T>): SingletonPromiseReturn<T> {
  let _promise: Promise<T> | undefined

  function wrapper() {
    if (!_promise)
      _promise = fn()
    return _promise
  }
  wrapper.reset = async () => {
    const _prev = _promise
    _promise = undefined
    if (_prev)
      await _prev
  }

  return wrapper
}

/**
 * Create a promise lock
 *
 * 创建一个 promise 锁
 *
 * @category Promise
 * @example
 * ```
 * const lock = createPromiseLock()
 *
 * lock.run(async () => {
 *   await doSomething()
 * })
 *
 * // in anther context:
 * await lock.wait() // it will wait all tasking finished
 * ```
 */
export function createPromiseLock() {
  const locks: Promise<any>[] = []

  return {
    async run<T = void>(fn: () => Promise<T>): Promise<T> {
      const p = fn()
      locks.push(p)
      try {
        return await p
      }
      finally {
        remove(locks, p)
      }
    },
    async wait(): Promise<void> {
      await Promise.allSettled(locks)
    },
    isWaiting() {
      return Boolean(locks.length)
    },
    clear() {
      locks.length = 0
    },
  }
}

/**
 * Promise with `resolve` and `reject` methods of itself
 *
 * @category Promise
 */
export interface ControlledPromise<T = void> extends Promise<T> {
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}

/**
 * Return a Promise with `resolve` and `reject` methods
 *
 * 返回一个 Promise，带有 `resolve` 和 `reject` 方法
 *
 * @category Promise
 * @example
 * ```
 * const promise = createControlledPromise()
 *
 * await promise
 *
 * // in anther context:
 * promise.resolve(data)
 * ```
 */
export function createControlledPromise<T>(): ControlledPromise<T> {
  let resolve: any, reject: any
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  }) as ControlledPromise<T>
  promise.resolve = resolve
  promise.reject = reject
  return promise
}

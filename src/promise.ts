import type { Fn } from './types'
import { isFunction } from './is'

/**
 * Sleeps for the given number of milliseconds.
 * @param ms - the number of milliseconds to sleep
 * @param callback - (optional) the function to execute after the sleep
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
 *
 * @category Promise
 *
 * @param promises - the array of promises to execute
 * @param concurrency - (optional) the maximum number of promises to execute in parallel
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

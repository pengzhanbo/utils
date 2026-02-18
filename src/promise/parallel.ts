import { isFunction } from '../predicate'

/**
 * Executes an array of promises in parallel with a given concurrency. The function
 * returns a Promise that resolves with an array containing the resolved values of
 * each promise.
 * If any promise is rejected, the returned promise will be rejected.
 *
 * 以指定的并发数并行执行一组 promise。该函数返回一个 promise，该 promise 解析为一个数组，包含每个 promise 的解析值。
 * 任意一个 promise 拒绝，返回的 promise 将被拒绝。
 *
 * @category Promise
 *
 * @param promises - The array of promises or promise-returning functions to execute. 要执行的promise数组或返回promise的函数数组
 * @param concurrency - (optional) The maximum number of promises to execute in parallel. Defaults to infinity. 最大并发数，默认为无穷大
 * @returns A Promise that resolves with an array containing the resolved values of each promise. 一个Promise，它解析为一个包含每个promise解析值的数组
 * @example
 * ```ts
 * const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]
 * const result = await promiseParallel(promises, 2) // maximum concurrency of 2 - 最大并发数为2
 * console.log(result) // [1, 2, 3]
 * ```
 */
export function promiseParallel(
  promises: (PromiseLike<any> | (() => PromiseLike<any>))[],
  concurrency: number = Number.POSITIVE_INFINITY,
): Promise<any[]> {
  promises = Array.from(promises)

  if (promises.length === 0) {
    return Promise.resolve([])
  }
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
          if (++resolvedCount === len) resolve(result)

          if (current < len) next()
        })
        .catch((reason) => reject(reason))
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
 * @param promises - The array of promises or promise-returning functions to execute. 要执行的promise数组或返回promise的函数数组
 * @param concurrency - (optional) The maximum number of promises to execute in parallel. Defaults to infinity. 最大并发数，默认为无穷大
 * @returns A Promise that resolves with an array of promise settlement results. 一个Promise，它解析为一个包含每个promise解析状态和值的数组
 * @example
 * ```ts
 * const promises = [Promise.resolve(1), Promise.resolve(2), Promise.reject('error')]
 * const result = await promiseParallelSettled(promises, 2) // maximum concurrency of 2 - 最大并发数为2
 * console.log(result) // [{ status: 'fulfilled', value: 1 }, { status: 'fulfilled', value: 2 }, { status: 'rejected', reason: 'error' }]
 * ```
 */
export function promiseParallelSettled(
  promises: (PromiseLike<any> | (() => PromiseLike<any>))[],
  concurrency: number = Number.POSITIVE_INFINITY,
): Promise<PromiseSettledResult<any>[]> {
  promises = Array.from(promises)

  if (promises.length === 0) {
    return Promise.resolve([])
  }

  let current = 0
  const result: PromiseSettledResult<any>[] = []
  let resolvedCount = 0
  const len = promises.length
  return new Promise((resolve) => {
    function resolved() {
      if (++resolvedCount === len) resolve(result)

      if (current < len) next()
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

import { assertPositiveInteger } from '../_internal/assert.js'
import { isFunction } from '../predicate/index.js'

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
 *
 * @remarks
 * This function fails fast: as soon as one task rejects, the returned promise
 * rejects and no further tasks are scheduled. Tasks already in flight keep
 * running, but their results are ignored. For a batch that runs every task
 * regardless of failures, use {@link promiseParallelSettled}; for limiting the
 * concurrency of a single function across call sites, use {@link limitAsync}.
 *
 * 此函数快速失败：一旦某个任务拒绝，返回的 promise 立即拒绝且不再调度后续任务。
 * 已在运行的任务会继续执行，但其结果会被忽略。如果希望无论失败与否都执行全部任务，
 * 请使用 {@link promiseParallelSettled}；如果希望限制单个函数在任意调用点的并发，
 * 请使用 {@link limitAsync}。
 *
 * @example
 * ```ts
 * const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]
 * const result = await promiseParallel(promises, 2) // maximum concurrency of 2 - 最大并发数为2
 * console.log(result) // [1, 2, 3]
 * ```
 *
 * @see {@link promiseParallelSettled} — for running every task regardless of failures / 无论成败都执行全部任务
 * @see {@link limitAsync} — for limiting a single function's concurrency / 限制单个函数的并发
 */
export function promiseParallel<T>(
  promises: (PromiseLike<T> | (() => PromiseLike<T>))[],
  concurrency: number = Number.POSITIVE_INFINITY,
): Promise<Awaited<T>[]> {
  const items = _parseParallelInputs(promises, concurrency)
  if (items.length === 0) {
    return Promise.resolve([])
  }
  let rejected = false
  let resolvedCount = 0
  const result: Awaited<T>[] = []
  return new Promise((resolve, reject) => {
    _runParallel(items, concurrency, (index, entry) => {
      if (rejected) {
        return false
      }
      if (entry.status === 'rejected') {
        rejected = true
        reject(entry.reason as Error)
        return false
      }
      result[index] = entry.value
      if (++resolvedCount === items.length) {
        resolve(result)
      }
    })
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
 * @param promises - The array of promises or promise-returning functions to execute. / 要执行的promise数组或返回promise的函数数组
 * @param concurrency - (optional) The maximum number of promises to execute in parallel. Defaults to infinity. / 最大并发数，默认为无穷大
 * @returns A Promise that resolves with an array of promise settlement results. / 一个Promise，它解析为一个包含每个promise解析状态和值的数组
 *
 * @example
 * ```ts
 * const promises = [Promise.resolve(1), Promise.resolve(2), Promise.reject('error')]
 * const result = await promiseParallelSettled(promises, 2) // maximum concurrency of 2 - 最大并发数为2
 * console.log(result) // [{ status: 'fulfilled', value: 1 }, { status: 'fulfilled', value: 2 }, { status: 'rejected', reason: 'error' }]
 * ```
 *
 * @see {@link promiseParallel} — for failing fast on the first rejection / 首个拒绝时快速失败
 */
export function promiseParallelSettled<T>(
  promises: (PromiseLike<T> | (() => PromiseLike<T>))[],
  concurrency: number = Number.POSITIVE_INFINITY,
): Promise<PromiseSettledResult<Awaited<T>>[]> {
  const items = _parseParallelInputs(promises, concurrency)
  if (items.length === 0) {
    return Promise.resolve([])
  }
  let resolvedCount = 0
  const result: PromiseSettledResult<Awaited<T>>[] = []
  return new Promise((resolve) => {
    _runParallel(items, concurrency, (index, entry) => {
      result[index] = entry
      if (++resolvedCount === items.length) {
        resolve(result)
      }
    })
  })
}

/**
 * Validate and copy the inputs, shared by both parallel variants.
 *
 * 校验并拷贝输入，两个 parallel 变体共用。
 *
 * @typeParam T - The type of the value / 值的类型
 * @param promises - The array of promises or promise-returning functions. / promise数组或返回promise的函数数组
 * @param concurrency - The maximum number of promises to execute in parallel. / 最大并发数
 * @returns The validated copy of the input array. / 校验后的输入数组副本
 * @throws {RangeError} If `concurrency` is not a positive integer. / 如果 `concurrency` 不是正整数
 */
function _parseParallelInputs<T>(
  promises: (PromiseLike<T> | (() => PromiseLike<T>))[],
  concurrency: number,
): (PromiseLike<T> | (() => PromiseLike<T>))[] {
  const items = Array.from(promises)
  if (concurrency !== Number.POSITIVE_INFINITY) {
    assertPositiveInteger(concurrency, 'concurrency')
  }
  return items
}

/**
 * Shared worker loop: schedules at most `concurrency` tasks at a time.
 * `onSettled` receives each settled result; return `false` to stop scheduling further tasks.
 *
 * 共享调度循环：同时最多调度 `concurrency` 个任务。
 * `onSettled` 接收每个已决结果，返回 `false` 可停止继续调度。
 *
 * @typeParam T - The type of the value / 值的类型
 * @param items - The array of promises or promise-returning functions. / promise数组或返回promise的函数数组
 * @param concurrency - The maximum number of promises to execute in parallel. / 最大并发数
 * @param onSettled - The callback invoked with each settled result; returning `false` stops scheduling. / 每个任务已决时调用的回调；返回 `false` 停止继续调度
 */
function _runParallel<T>(
  items: (PromiseLike<T> | (() => PromiseLike<T>))[],
  concurrency: number,
  onSettled: (index: number, result: PromiseSettledResult<Awaited<T>>) => boolean | void,
): void {
  let current = 0
  const len = items.length
  function next(): void {
    const index = current++
    const item = items[index]!
    Promise.resolve(isFunction(item) ? item() : item)
      .then((value) => {
        if (onSettled(index, { status: 'fulfilled', value }) !== false && current < len) {
          next()
        }
      })
      .catch((reason) => {
        if (onSettled(index, { status: 'rejected', reason }) !== false && current < len) {
          next()
        }
      })
  }
  for (let i = 0; i < concurrency && i < len; i++) {
    next()
  }
}

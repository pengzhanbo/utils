import { assertPositiveInteger } from '../_internal/assert.js'
import { Semaphore } from './semaphore.js'

/**
 * Wraps an async function to limit the number of concurrent executions.
 *
 * This function creates a wrapper around an async callback that ensures at most
 * `concurrency` number of executions can run simultaneously. Additional calls will
 * wait until a slot becomes available.
 *
 * 将异步函数包装起来以限制并发执行的数量。
 *
 * 此函数创建一个异步回调的包装器，确保最多只有`concurrency`个执行可以同时运行。
 * 额外的调用将等待直到有可用的执行槽位。
 *
 * @category Promise
 *
 * @typeParam F - The type of the function / 函数的类型
 * @param callback - The async function to wrap. / 要包装的异步函数
 * @param concurrency - The maximum number of concurrent executions. / 最大并发数
 * @returns The wrapped async function. / 包装后的异步函数
 *
 * @remarks
 * This is a call-site limiter: every invocation of the returned function shares
 * the same concurrency budget, no matter where it is called from. Unlike
 * {@link promiseParallel}, it does not collect a batch of tasks, and it has no
 * fast-fail behavior — when combined with `Promise.all`, every call is eventually
 * executed even if some of them reject. Under the hood it is built on
 * {@link Semaphore}.
 *
 * 这是调用点限流器：无论从何处调用，返回函数的每次调用都共享同一个并发预算。
 * 与 {@link promiseParallel} 不同，它不收集一批任务，也没有 fast-fail 行为——
 * 与 `Promise.all` 组合时，即使部分调用失败，所有调用最终也都会执行。
 * 底层基于 {@link Semaphore} 实现。
 *
 * @example
 * ```ts
 * const limitedFetch = limitAsync(async (url) => {
 *   return await fetch(url);
 * }, 3);
 *
 * // Only 3 fetches will run concurrently
 * const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
 * await Promise.all(urls.map(url => limitedFetch(url)));
 * ```
 *
 * @see {@link promiseParallel} — for executing a batch of tasks with concurrency / 批量执行任务并限制并发
 * @see {@link Semaphore} — the underlying primitive / 底层原语
 */
export function limitAsync<F extends (...args: any[]) => Promise<any>>(
  callback: F,
  concurrency: number,
): F {
  assertPositiveInteger(concurrency, 'concurrency')
  const semaphore = new Semaphore(concurrency)

  return async function func(this: ThisType<F>, ...args: Parameters<F>): Promise<ReturnType<F>> {
    try {
      await semaphore.acquire()
      return await callback.apply(this, args)
    } finally {
      semaphore.release()
    }
  } as F
}

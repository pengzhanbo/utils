import { Semaphore } from '../promise'

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
 * @category Array
 * @param callback - The async function to wrap. - 要包装的异步函数
 * @param concurrency - The maximum number of concurrent executions. - 最大并发数
 * @returns The wrapped async function. - 包装后的异步函数
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
 */
export function limitAsync<F extends (...args: any[]) => Promise<any>>(callback: F, concurrency: number): F {
  const semaphore = new Semaphore(concurrency)

  return async function (this: ThisType<F>, ...args: Parameters<F>): Promise<ReturnType<F>> {
    try {
      await semaphore.acquire()
      return await callback.apply(this, args)
    }
    finally {
      semaphore.release()
    }
  } as F
}

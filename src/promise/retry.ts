import { RetryError } from '../error'

export interface RetryOptions {
  /**
   * The number of times to retry, default is 3
   *
   * 重试次数，默认 3
   */
  limit?: number
  /**
   * The delay between retries, default is 0
   *
   * 重试间隔，默认为 0
   */
  delay?: number
}
/**
 * Retry a async function with a delay
 *
 * 重试异步函数并设置延迟
 *
 * @category Promise
 * @param fn - the function to retry 重试的异步函数
 * @param options - the options for retry 重试选项
 * @param options.limit
 * @param options.delay
 *
 * @example
 * ```ts
 * const result = await retry(async () => {
 *   return await fetch('https://example.com').then((res) => res.json())
 * }, {  limit: 3, delay: 1000 })
 * ```
 */
export function retry<T>(
  fn: () => Promise<T>,
  { limit = 3, delay = 0 }: RetryOptions = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0
    const retry = () => {
      fn()
        .then(resolve)
        .catch((error) => {
          attempts++
          if (attempts < limit) {
            setTimeout(retry, delay)
          } else {
            reject(new RetryError(attempts, (error as Error).message))
          }
        })
    }
    retry()
  })
}

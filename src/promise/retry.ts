// oxlint-disable max-lines-per-function

import { timestamp } from '../date/index.js'
import { AbortError, RetryError, TimeoutError } from '../error/index.js'
import { isError } from '../predicate/index.js'

export interface RetryOptions {
  /**
   * The total number of attempts (including the initial call), default is 3
   *
   * 总尝试次数（包含初始调用），默认 3
   */
  limit?: number
  /**
   * The delay between retries, default is 0
   *
   * 重试间隔，默认为 0
   */
  delay?: number
  /**
   * AbortSignal for cancellation. When aborted, the retry will be rejected with AbortError.
   *
   * 用于取消的 AbortSignal。当触发中止时，重试将被拒绝并返回 AbortError。
   */
  signal?: AbortSignal
  /**
   * Maximum total time in milliseconds for all retries. If exceeded, the retry will be rejected with TimeoutError.
   *
   * 所有重试的最大总时间（毫秒）。如果超过此时间，重试将被拒绝并返回 TimeoutError。
   */
  timeout?: number
}

export type RetryablePromise<T> = Promise<T> & {
  cancel: () => void
}

/**
 * Retry a async function with a delay
 *
 * 重试异步函数并设置延迟
 *
 * @category Promise
 *
 * @typeParam T - The type of the resolved value / 解析值的类型
 * @param fn - the function to retry / 重试的异步函数
 * @param options - the options for retry / 重试选项
 * @param options.limit - The total number of attempts (including the initial call), default is 3 / 总尝试次数（包含初始调用），默认 3
 * @param options.delay - The delay between retries, default is 0 / 重试间隔，默认为 0
 * @param options.signal - AbortSignal for cancellation (optional) / 用于取消的 AbortSignal（可选）
 * @param options.timeout - Maximum total time in milliseconds (optional) / 最大总时间（毫秒，可选）
 *
 * @returns The promise that resolves to the result of the function / 返回解析到函数结果的 promise
 *
 * @example
 * ```ts
 * const result = await retry(async () => {
 *   return await fetch('https://example.com').then((res) => res.json())
 * }, { limit: 3, delay: 1000 })
 * ```
 *
 * @example
 * With cancellation / 带取消功能
 * ```ts
 * const controller = new AbortController()
 * const promise = retry(fetchData, { signal: controller.signal })
 *
 * // Cancel the retry / 取消重试
 * controller.abort()
 * ```
 *
 * @example
 * With timeout / 带超时限制
 * ```ts
 * try {
 *   const result = await retry(fetchData, { limit: 5, timeout: 10000 })
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     console.log('Retry timed out after 10 seconds')
 *   }
 * }
 * ```
 */
export function retry<T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  { limit = 3, delay = 0, signal, timeout }: RetryOptions = {},
): RetryablePromise<T> {
  if (limit < 1) {
    throw new RangeError('limit must be at least 1')
  }
  if (delay < 0) {
    throw new RangeError('delay must be non-negative')
  }
  if (timeout !== undefined && timeout <= 0) {
    throw new RangeError('timeout must be positive')
  }

  let cancelled = false
  let settled = false
  let timer: ReturnType<typeof setTimeout> | undefined
  let timeoutTimer: ReturnType<typeof setTimeout> | undefined
  let rejectFn: (reason?: unknown) => void
  let timeoutController: AbortController | undefined

  const cleanup = (): void => {
    if (settled) {
      return
    }
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
    if (timeoutTimer) {
      clearTimeout(timeoutTimer)
      timeoutTimer = undefined
    }
    timeoutController?.abort()
    signal?.removeEventListener('abort', cleanup)
    if (!cancelled) {
      cancelled = true
      settled = true
      rejectFn(new AbortError())
    }
  }

  if (signal) {
    if (signal.aborted) {
      return Object.assign(Promise.reject(new AbortError()), {
        cancel: () => {},
      })
    }
    signal.addEventListener('abort', cleanup, { once: true })
  }

  const startTime = Date.now()

  const promise = new Promise<T>((resolve, reject) => {
    rejectFn = reject
    let attempts = 0

    const retryFn = (): void => {
      /* istanbul ignore if -- @preserve */
      if (cancelled) {
        return
      }

      if (timeout && timestamp() - startTime > timeout) {
        settled = true
        signal?.removeEventListener('abort', cleanup)
        reject(new TimeoutError())
        return
      }

      timeoutController = new AbortController()
      const combinedSignal = signal
        ? AbortSignal.any([signal, timeoutController.signal])
        : timeoutController.signal

      if (timeout) {
        const remaining = timeout - (timestamp() - startTime)
        if (remaining <= 0) {
          settled = true
          signal?.removeEventListener('abort', cleanup)
          reject(new TimeoutError())
          return
        }
        timeoutTimer = setTimeout(() => {
          timeoutController?.abort()
          settled = true
          signal?.removeEventListener('abort', cleanup)
          rejectFn(new TimeoutError())
        }, remaining)
      }

      const handleSuccess = (value: T): void => {
        if (settled) {
          return
        }
        settled = true
        if (timeoutTimer) {
          clearTimeout(timeoutTimer)
          timeoutTimer = undefined
        }
        timeoutController = undefined
        signal?.removeEventListener('abort', cleanup)
        resolve(value)
      }

      const handleError = (error: unknown): void => {
        if (settled) {
          return
        }
        if (timeoutTimer) {
          clearTimeout(timeoutTimer)
          timeoutTimer = undefined
        }
        timeoutController = undefined
        attempts++
        if (attempts < limit && !cancelled) {
          timer = setTimeout(retryFn, delay)
        } else {
          settled = true
          signal?.removeEventListener('abort', cleanup)
          reject(
            new RetryError(attempts, isError(error) ? error.message : String(error), {
              cause: error,
            }),
          )
        }
      }

      try {
        fn(combinedSignal).then(handleSuccess).catch(handleError)
      } catch (syncError) {
        handleError(syncError)
      }
    }

    retryFn()
  })

  return Object.assign(promise, { cancel: cleanup })
}

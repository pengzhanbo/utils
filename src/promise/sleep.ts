import { AbortError } from '../error/AbortError'

export interface SleepOptions {
  signal?: AbortSignal
}

/**
 * Sleeps for the given number of milliseconds.
 *
 * 给定毫秒数睡眠。
 *
 * @category Promise
 *
 * @param ms - The number of milliseconds to sleep. 睡眠的毫秒数
 * @param options - The options for the sleep. 睡眠的配置项
 * @param options.signal - The signal to abort the sleep. 睡眠的中止信号
 * @returns A promise that resolves after the specified delay. 在指定延迟后解析的Promise
 * @throws {AbortError} If the sleep is aborted via the signal. 如果通过信号中止睡眠
 *
 * @example
 * ```ts
 * console.log('Start');
 * await sleep(1000); // Delays execution for 1 second
 * console.log('End');
 * ```
 *
 * @example
 * ```ts
 * const controller = new AbortController();
 * const { signal } = controller;
 *
 * setTimeout(() => controller.abort(), 50); // Will cancel the delay after 50ms
 * try {
 *   await sleep(100, { signal });
 * } catch (error) {
 *   console.error(error); // Will log 'AbortError'
 * }
 * ```
 */
export async function sleep(ms: number, { signal }: SleepOptions = {}): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let timeoutId: NodeJS.Timeout | undefined
    const abortError = () => {
      reject(new AbortError())
    }
    const abortHandler = () => {
      clearTimeout(timeoutId)
      abortError()
    }

    if (signal?.aborted) {
      return abortError()
    }

    timeoutId = setTimeout(async () => {
      signal?.removeEventListener('abort', abortHandler)
      resolve()
    }, ms)
    signal?.addEventListener('abort', abortHandler, { once: true })
  })
}

/**
 * Alias for `sleep`, Delays for the given number of milliseconds.
 *
 * `sleep` 的别名, 给定毫秒数延迟。
 *
 * also see {@link sleep}
 *
 * @category Promise
 */
export const delay: typeof sleep = sleep

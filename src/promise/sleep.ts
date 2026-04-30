export interface SleepOptions {
  /**
   * The signal to abort the sleep.
   *
   * 睡眠的中止信号
   */
  signal?: AbortSignal
}

/**
 * Sleeps for the given number of milliseconds.
 *
 * 给定毫秒数睡眠。
 *
 * @category Promise
 *
 * @param ms - The number of milliseconds to sleep. / 睡眠的毫秒数
 * @param options - The options for the sleep. / 睡眠的配置项
 * @param options.signal - The signal to abort the sleep. / 睡眠的中止信号
 * @returns A promise that resolves after the specified delay. / 在指定延迟后解析的Promise
 *
 * @throws {DOMException} If the sleep is aborted via the signal. / 如果通过信号中止睡眠
 *
 * @see {@link timeout} — for rejecting after a delay
 * @see {@link timeout} — 在延迟后拒绝
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
export function sleep(ms: number, { signal }: SleepOptions = {}): Promise<void> {
  if (!Number.isFinite(ms) || ms < 0)
    throw new RangeError('ms must be a finite non-negative number')
  return new Promise<void>((resolve, reject) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const abortError = () => {
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const abortHandler = () => {
      clearTimeout(timeoutId)
      abortError()
    }

    if (signal?.aborted) {
      return abortError()
    }

    timeoutId = setTimeout(() => {
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

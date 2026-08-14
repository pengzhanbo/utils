import { AbortError } from '../error/AbortError.js'
import { TimeoutError } from '../error/TimeoutError.js'
import { sleep } from './sleep.js'

export interface UntilOptions {
  /**
   * The interval between condition checks in milliseconds.
   *
   * 两次条件检查之间的间隔毫秒数
   *
   * @default 100
   */
  interval?: number
  /**
   * The maximum time in milliseconds to wait before rejecting with a `TimeoutError`.
   *
   * 在抛出 `TimeoutError` 之前等待的最大毫秒数
   */
  timeout?: number
  /**
   * The signal to abort the polling.
   *
   * 中止轮询的信号
   */
  signal?: AbortSignal
}

/**
 * Polls a condition until it returns true, a timeout elapses, or the signal is aborted.
 *
 * 轮询直到条件返回 true、超时或信号被中止。
 *
 * @category Promise
 *
 * @param condition - The function to evaluate. It can return a boolean or a promise of a boolean. / 要评估的函数，可以返回布尔值或布尔值的 promise
 * @param options - The options for the polling. / 轮询的配置项
 * @param options.interval - The interval between condition checks in milliseconds. Defaults to 100. / 两次条件检查之间的间隔毫秒数，默认 100
 * @param options.timeout - The maximum time in milliseconds to wait before rejecting. Defaults to no timeout. / 在拒绝前等待的最大毫秒数，默认不超时
 * @param options.signal - The signal to abort the polling. / 中止轮询的信号
 * @returns A promise that resolves when the condition becomes true. / 条件为 true 时解析的 promise
 *
 * @throws {RangeError} If `interval` is negative. / 如果 `interval` 为负数
 * @throws {AbortError} If the polling is aborted via the signal. / 如果通过信号中止轮询
 * @throws {TimeoutError} If `timeout` elapses before the condition becomes true. / 如果条件为 true 前已超时
 *
 * @see {@link sleep} — for delaying between checks
 * @see {@link sleep} — 用于在检查之间延迟
 *
 * @example
 * ```ts
 * await until(() => file.ready, { interval: 100, timeout: 5000 });
 * ```
 */
export async function until(
  condition: () => boolean | Promise<boolean>,
  options: UntilOptions = {},
): Promise<void> {
  const { interval = 100, timeout: timeoutMs, signal } = options
  if (interval < 0) {
    throw new RangeError('interval must be a non-negative number')
  }
  const deadline = timeoutMs == null ? Number.POSITIVE_INFINITY : Date.now() + timeoutMs
  for (;;) {
    if (signal?.aborted) {
      throw new AbortError()
    }
    if (await condition()) {
      return
    }
    if (Date.now() >= deadline) {
      throw new TimeoutError()
    }
    await sleep(interval, { signal })
  }
}

import { TimeoutError } from '../error/TimeoutError'
import { isKeyof, isUndefined } from '../predicate'
import { sleep } from './sleep'

/**
 * Returns a promise that rejects with a `TimeoutError` after a specified delay.
 *
 * 返回一个 promise，该 promise 在指定的延迟时间后拒绝，抛出一个 `TimeoutError`。
 *
 * @category Promise
 *
 * @param ms - the number of milliseconds to wait before rejecting the promise. / 超时的毫秒数
 * @returns A promise that rejects with a `TimeoutError` after the specified delay. / 一个 promise，它将在指定的延迟时间后拒绝，抛出一个 `TimeoutError`。
 *
 * @throws {TimeoutError} Throws a TimeoutError after the specified delay. / 在指定的延迟时间后抛出 TimeoutError。
 *
 * @example
 * ```ts
 * try {
 *   await timeout(1000); // Timeout exception after 1 second
 * } catch (error) {
 *   console.error(error); // Will log 'The operation was timed out'
 * }
 * ```
 */
export async function timeout(ms: number): Promise<never> {
  await sleep(ms)
  throw new TimeoutError()
}

export interface WithTimeoutOptions<T> {
  /** Custom error message for timeout / 超时错误信息 */
  message?: string
  /** Fallback value returned on timeout instead of throwing (optional) / 超时时返回的回退值（可选） */
  fallback?: T
  /** External AbortSignal for cancellation awareness in run(). / 外部取消信号（通过 AbortSignal.any() 合并后传给 run 函数） */
  signal?: AbortSignal
}

export interface WithTimeoutResult<T> extends Promise<T> {
  cancel: () => void
}

/**
 * Executes an async function and enforces a timeout.
 *
 * 执行异步函数, 超时则强制拒绝。支持 AbortController 取消和超时回退值。
 *
 * @category Promise
 *
 * @param run - The async function to execute, receives an AbortSignal for cancellation awareness.
 *              When an external `signal` is provided via options, it is merged with the internal
 *              signal using `AbortSignal.any()`, so the function can respond to both external
 *              cancellation and internal timeout/cancel.
 *              执行的异步函数，接收 AbortSignal 用于感知取消。若通过 options 提供了外部 signal，
 *              则使用 `AbortSignal.any()` 与内部信号合并，使函数能同时响应外部取消和内部超时/取消。
 * @param ms - The number of milliseconds before timing out. 超时毫秒数
 * @param options - Options. 选项
 * @param options.message - Custom timeout message. 自定义超时消息
 * @param options.fallback - Value to return on timeout instead of throwing. 超时回退值
 * @param options.signal - External AbortSignal merged with internal signal via AbortSignal.any()
 *                           for cancellation awareness. Aborting the external signal will
 *                           immediately notify the running function and reject with AbortError.
 *                           Timeout/cancel will also abort the combined signal seen by run().
 *                           外部取消信号，通过 AbortSignal.any() 与内部信号合并传给 run() 函数。
 *                           中止外部信号会立即通知运行中的函数并以 AbortError 拒绝。
 *                           超时/取消也会中止 run() 看到的合并信号。
 * @returns
 * A promise that resolves with the result, or rejects with TimeoutError.
 * Supports `.cancel()` method for manual cancellation.
 *
 * 一个 promise，解析为异步函数结果，或超时/取消时拒绝。
 * 支持 `.cancel()` 方法手动取消。
 *
 * @example
 * Basic usage:
 * ```ts
 * const data = await withTimeout(
 *   async (signal) => {
 *     const res = await fetch(url, { signal })
 *     return res.json()
 *   },
 *   5000,
 * )
 * ```
 *
 * @example
 * Combined signal with external AbortController:
 * ```ts
 * const controller = new AbortController()
 * const result = await withTimeout(
 *   async (signal) => {
 *     // signal is a combined signal from AbortSignal.any()
 *     // It responds to both external abort and internal timeout/cancel
 *     return fetch(url, { signal }).then(r => r.json())
 *   },
 *   5000,
 *   { signal: controller.signal },
 * )
 * // Externally aborting cancels fetch AND withTimeout:
 * controller.abort()
 * ```
 *
 * @example
 * With fallback value:
 * ```ts
 * const result = await withTimeout(
 *   () => slowOperation(),
 *   1000,
 *   { fallback: 'default' },
 * ) // => 'default' if timed out
 * ```
 *
 * @example
 * Manual cancellation:
 * ```ts
 * const task = withTimeout(() => longRunning(), 10000)
 * task.cancel() // Cancel immediately without waiting
 * ```
 */
export function withTimeout<T>(
  run: (signal: AbortSignal) => Promise<T>,
  ms: number,
  options?: WithTimeoutOptions<T>,
): WithTimeoutResult<T>
export function withTimeout<T>(
  run: () => Promise<T>,
  ms: number,
  options?: WithTimeoutOptions<T>,
): WithTimeoutResult<T>
export function withTimeout<T>(
  run: ((signal: AbortSignal) => Promise<T>) | (() => Promise<T>),
  ms: number,
  options: WithTimeoutOptions<T> = {},
): WithTimeoutResult<T> {
  if (!Number.isFinite(ms) || ms < 0)
    throw new RangeError('ms must be a finite non-negative number')
  const { message, signal: externalSignal } = options

  const controller = new AbortController()
  let settled = false
  let timer: ReturnType<typeof setTimeout> | undefined
  let abortHandler: (() => void) | undefined

  let _reject!: (reason: unknown) => void
  let _resolve!: (value: T | PromiseLike<T>) => void

  const runSignal: AbortSignal = externalSignal
    ? AbortSignal.any([externalSignal, controller.signal])
    : controller.signal

  const cleanup = (): void => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
    if (abortHandler) {
      externalSignal?.removeEventListener('abort', abortHandler)
      abortHandler = undefined
    }
  }

  const finish = (type: 'timeout' | 'abort' | 'error' | 'success', value?: unknown): void => {
    if (settled) return
    settled = true
    cleanup()

    if (type === 'success') return _resolve(value as T)
    if (type === 'timeout') {
      if (isKeyof(options, 'fallback') && !isUndefined(options.fallback))
        return _resolve(options.fallback as T)
      return _reject(new TimeoutError(message))
    }
    if (type === 'abort') return _reject(new DOMException('Aborted', 'AbortError'))
    _reject(value)
  }

  const promise = new Promise<T>((resolve, reject) => {
    _resolve = resolve
    _reject = reject

    if (runSignal.aborted) return finish('abort')

    // Only listen for abort on the external signal.
    // With AbortSignal.any(), the combined signal (runSignal) will also be
    // aborted when the external signal fires, but we need to distinguish
    // external abort from timeout/cancel. Listening on the external signal
    // specifically ensures that only external abort triggers finish('abort'),
    // while timeout/cancel is handled by controller.abort() → finish('timeout'/'abort').
    //
    // 仅在外部信号上监听 abort 事件。
    // 使用 AbortSignal.any() 后，外部信号触发时合并信号也会被中止，
    // 但需要区分外部中止和超时/取消。仅在外部信号上监听确保只有外部中止
    // 触发 finish('abort')，而超时/取消由 controller.abort() → finish() 处理。
    if (externalSignal) {
      abortHandler = () => finish('abort')
      externalSignal.addEventListener('abort', abortHandler, { once: true })
    }

    timer = setTimeout(() => {
      controller.abort()
      finish('timeout')
    }, ms)

    run(runSignal).then(
      (result) => finish('success', result),
      (e) => finish('error', e),
    )
  }) as WithTimeoutResult<T>

  promise.cancel = (): void => {
    if (settled) return
    controller.abort()
    finish('abort')
  }

  return promise
}

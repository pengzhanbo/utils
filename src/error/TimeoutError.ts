/**
 * An error class representing a timeout operation.
 *
 * 表示操作超时的错误类。
 *
 * @category Error
 *
 * @param message - The error message. 错误消息
 * @param options - The error options. 错误选项
 *
 * @example
 * ```ts
 * new TimeoutError()
 * // => TimeoutError: The operation was timed out
 * ```
 *
 * @augments Error
 */
export class TimeoutError extends Error {
  constructor(message = 'The operation was timed out', options?: ErrorOptions) {
    super(message, options)
    this.name = 'TimeoutError'
  }
}

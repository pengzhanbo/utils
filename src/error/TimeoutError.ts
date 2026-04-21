/**
 * An error class representing an timeout operation.
 *
 * 表示操作超时的错误类。
 *
 * @category Error
 * @augments Error
 *
 * @param message - The error message. 错误消息
 *
 * @example
 * ```ts
 * new TimeoutError()
 * // => TimeoutError: The operation was timed out
 * ```
 */
export class TimeoutError extends Error {
  constructor(message = 'The operation was timed out') {
    super(message)
    this.name = 'TimeoutError'
  }
}

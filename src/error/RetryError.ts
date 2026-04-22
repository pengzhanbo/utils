/**
 * An error class representing an aborted operation.
 *
 * 表示重试操作失败的错误类。
 *
 * @category Error
 * @augments Error
 *
 * @param attempts - The number of attempts. 尝试次数
 * @param message - The error message. 错误消息
 *
 * @example
 * ```ts
 * new RetryError(3)
 * // => RetryError: The retry operation failed
 * ```
 */
export class RetryError extends Error {
  attempts: number
  constructor(attempts: number, message = 'The retry operation failed') {
    super(message)
    this.name = 'RetryError'
    this.attempts = attempts || 0
  }
}

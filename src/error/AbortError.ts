/**
 * An error class representing an aborted operation.
 *
 * 表示操作被中止的错误类。
 *
 * @category Error
 * @augments Error
 *
 * @param message - The error message. 错误消息
 */
export class AbortError extends Error {
  constructor(message = 'The operation was aborted') {
    super(message)
    this.name = 'AbortError'
  }
}

/**
 * An error class representing an aborted operation.
 *
 * 表示操作被中止的错误类。
 *
 * @category Error
 *
 * @param message - The error message. 错误消息
 * @param options - The error options. 错误选项
 *
 * @example
 * ```ts
 * new AbortError()
 * // => AbortError: The operation was aborted
 * ```
 *
 * @augments Error
 */
export class AbortError extends Error {
  constructor(message = 'The operation was aborted', options?: ErrorOptions) {
    super(message, options)
    this.name = 'AbortError'
  }
}

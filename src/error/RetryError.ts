/**
 * An error class representing a failed retry operation.
 *
 * 表示重试操作失败的错误类。
 *
 * @category Error
 *
 * @param attempts - The number of attempts. 尝试次数
 * @param message - The error message. 错误消息
 *
 * @remarks
 * The constructor clamps the `attempts` parameter to a non-negative integer using `Math.max(0, Math.trunc(attempts))`. Negative values are silently converted to 0, and fractional values are truncated.
 *
 * 构造函数会通过 `Math.max(0, Math.trunc(attempts))` 将 `attempts` 参数钳位为非负整数。负值会被静默转换为 0，小数值会被截断。
 *
 * @example
 * ```ts
 * new RetryError(3)
 * // => RetryError: The retry operation failed
 * ```
 *
 * @augments Error
 */
export class RetryError extends Error {
  readonly attempts: number
  constructor(attempts: number, message = 'The retry operation failed', options?: ErrorOptions) {
    super(message, options)
    this.name = 'RetryError'
    this.attempts = Math.max(0, Math.trunc(attempts))
  }
}

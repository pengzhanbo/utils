/**
 * Assert that the value is a finite non-negative number, otherwise throw a `RangeError`.
 *
 * 断言值为有限非负数，否则抛出 `RangeError`。
 *
 * @param value - The number to assert. 要断言的数字
 * @param name - The parameter name used in the error message. 错误消息中使用的参数名
 *
 * @throws {RangeError} If `value` is not a finite non-negative number. 如果 `value` 不是有限非负数
 *
 * @example
 * ```ts
 * assertFiniteNonNegativeNumber(1000, 'ms') // ok
 * assertFiniteNonNegativeNumber(-1, 'ms') // => RangeError: ms must be a finite non-negative number
 * ```
 * @internal
 */
export function assertFiniteNonNegativeNumber(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number`)
  }
}

/**
 * Assert that the value is a positive integer, otherwise throw a `RangeError`.
 *
 * 断言值为正整数，否则抛出 `RangeError`。
 *
 * @param value - The number to assert. 要断言的数字
 * @param name - The parameter name used in the error message. 错误消息中使用的参数名
 *
 * @throws {RangeError} If `value` is not a positive integer. 如果 `value` 不是正整数
 *
 * @example
 * ```ts
 * assertPositiveInteger(3, 'concurrency') // ok
 * assertPositiveInteger(1.5, 'concurrency') // => RangeError: concurrency must be a positive integer
 * ```
 * @internal
 */
export function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${name} must be a positive integer`)
  }
}

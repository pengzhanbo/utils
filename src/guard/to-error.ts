import { isError } from '../predicate/is-error'

/**
 * Ensures a value is an Error, throws if not
 *
 * 确保值是 Error，如果不是则抛出错误
 *
 * @category Guard
 *
 * @param v - The value to check. 要检查的值
 * @param message - Custom error message if the value is not an Error. 如果值不是 Error 时的自定义错误消息
 * @returns The value if it is an Error. 如果是 Error 则返回该值
 * @throws Error if the value is not an Error. 如果值不是 Error 则抛出错误
 *
 * @example
 * ```ts
 * toError(new Error('test')) // => Error('test')
 * toError('not an error', 'Expected an Error') // => throws Error('Expected an Error')
 * ```
 */
export function toError(v: unknown, message?: string): Error {
  if (!isError(v)) {
    throw new Error(message ?? 'Expected an Error')
  }
  return v
}

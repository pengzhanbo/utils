import { T_OBJECT } from '../_internal/tags'
import { isString } from './is-string'
import { typeOf } from './type-of'

/**
 * Check if a value is an Error object
 *
 * 检查值是否为错误对象
 *
 * @category Predicate
 *
 * @param value - The value to check. 要检查的值
 * @returns True if the value is an Error object, false otherwise. 如果值为错误对象则返回true，否则返回false
 */
export function isError(value: unknown): value is Error {
  if (value instanceof Error) {
    return true
  }

  // Cross-iframe / cross-realm Error detection
  // oxlint-disable-next-line valid-typeof
  if (typeof value !== T_OBJECT) {
    return false
  }

  const type = typeOf(value)
  const is = type === 'error' || type === 'domException' || type === 'aggregateError'

  return is && isString((value as Error).message) && isString((value as Error).stack)
}

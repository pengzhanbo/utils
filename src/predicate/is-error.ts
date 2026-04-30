import { T_AGGREGATE_ERROR, T_DOM_EXCEPTION, T_ERROR, T_OBJECT } from '../_internal/tags'
import { isString } from './is-string'
import { typeOf } from './type-of'

/**
 * Check if a value is an Error object.
 *
 * 检查值是否为错误对象。
 *
 * @category Predicate
 *
 * @param value - The value to check. 要检查的值
 *
 * @returns True if the value is an Error object, false otherwise. 如果值为错误对象则返回 true，否则返回 false
 *
 * @remarks
 * This function uses cross-realm detection: it first attempts `instanceof Error`, which works within the same realm.
 * When that fails, it falls back to `typeOf('error')` to detect Error instances from cross-iframe or cross-VM contexts.
 *
 * 该函数使用跨环境检测：首先尝试 `instanceof Error`，在同一环境下此方法有效。
 * 当检测失败时，回退到 `typeOf('error')` 以检测来自跨 iframe 或跨 VM 上下文的 Error 实例。
 *
 * @example
 * ```ts
 * isError(new Error('test')) // => true
 * isError({ message: 'test' }) // => false
 * ```
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
  const is = type === T_ERROR || type === T_DOM_EXCEPTION || type === T_AGGREGATE_ERROR

  return is && isString((value as Error).message)
}

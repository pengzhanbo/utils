import { T_FUNCTION } from '../_internal/tags'
import { isNil } from './is-nil'
import { isTypeof } from './is-typeof'

/**
 * Checks if the input is an iterable object.
 *
 * 检查输入是否为可迭代对象。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is iterable, false otherwise. 如果值为可迭代对象则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isIterable([]) // => true
 * isIterable(new Map()) // => true
 * isIterable({}) // => false
 * ```
 */
export function isIterable(v: unknown): v is Iterable<unknown> {
  return !isNil(v) && isTypeof((v as any)?.[Symbol.iterator], T_FUNCTION)
}

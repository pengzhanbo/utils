import { T_FUNCTION } from '../_internal/tags'

/**
 * Checks if the input is a function.
 *
 * 检查输入是否为函数
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a function, false otherwise. 如果值为函数则返回true，否则返回false
 */
export function isFunction<T extends (...args: any[]) => any>(v: unknown): v is T {
  // eslint-disable-next-line valid-typeof
  return typeof v === T_FUNCTION
}

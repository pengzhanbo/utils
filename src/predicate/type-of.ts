import { T_OBJECT } from '../_internal/tags'
import { T_FUNCTION } from '../_internal/tags'
import { toString } from '../guard'

/**
 * Get the type of a value
 *
 * 获取值的类型
 *
 * @category Common
 *
 * @param s - The value to get the type of. 要获取类型的值
 * @returns The type of the value as a string. 值的类型字符串
 */
export function typeOf(s: unknown): string {
  const type = typeof s
  return s === null
    ? 'null'
    : type === T_OBJECT || type === T_FUNCTION
      ? toString(s).slice(8, -1).toLowerCase()
      : type
}

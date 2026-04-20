import { isNull } from './is-null'
import { isUndefined } from './is-undefined'

/**
 * Checks if the input is null or undefined
 *
 * 检查输入是否为 null 或 undefined
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is null or undefined, false otherwise. 如果值为 null 或 undefined 则返回 true，否则返回 false
 */
export function isNil(v: unknown): v is null | undefined {
  return isNull(v) || isUndefined(v)
}

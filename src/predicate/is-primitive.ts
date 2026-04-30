import { T_FUNCTION, T_OBJECT } from '../_internal/tags'
import { isNil } from './is-nil'

/**
 * Checks if the input is a primitive.
 *
 * 检查输入是否为原始值。
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 *
 * @returns True if the value is a primitive, false otherwise. 如果值为原始值则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isPrimitive(42) // => true
 * isPrimitive({}) // => false
 * ```
 */
export function isPrimitive(
  v: unknown,
): v is null | undefined | boolean | number | string | symbol | bigint {
  // oxlint-disable-next-line valid-typeof
  return isNil(v) || (typeof v !== T_OBJECT && typeof v !== T_FUNCTION)
}

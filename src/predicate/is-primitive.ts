import { T_FUNCTION, T_OBJECT } from '../_internal/tags'

/**
 * Checks if the input is a primitive
 *
 * 检查输入是否为原始值
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a primitive, false otherwise. 如果值为原始值则返回true，否则返回false
 */
export function isPrimitive(
  v: unknown,
): v is null | undefined | boolean | number | string | symbol | bigint {
  // oxlint-disable-next-line valid-typeof
  return v === null || (typeof v !== T_OBJECT && typeof v !== T_FUNCTION)
}

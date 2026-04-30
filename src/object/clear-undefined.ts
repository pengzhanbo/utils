import { del } from '../_internal/reflect'
import { isUndefined } from '../predicate'
import { objectKeys } from './keys'

/**
 * Remove keys with undefined values from an object
 *
 * 从对象中删除值为 undefined 的键
 *
 * @category Object
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param obj - The object to remove undefined keys from / 要删除值为 undefined 键的对象
 * @returns The object with undefined keys removed / 移除了值为 undefined 键的对象
 *
 * @remarks
 * This function mutates the original object in place by deleting keys whose value is `undefined`. It does not create a copy.
 *
 * 此函数会直接修改原对象，删除值为 `undefined` 的键。不会创建副本。
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: undefined }
 * clearUndefined(obj) // { a: 1 }
 * ```
 */
export function clearUndefined<T extends object>(obj: T): T {
  for (const key of objectKeys(obj)) {
    // @ts-expect-error
    if (isUndefined(obj[key])) del(obj, key)
  }
  return obj
}

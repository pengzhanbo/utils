import { del } from '../_internal/reflect'

/**
 * Remove keys with undefined values from an object
 *
 * 从对象中删除值为 undefined 的键
 *
 * @param obj - The object to remove undefined keys from 要删除值为 undefined 键的对象
 * @returns The object with undefined keys removed 移除了值为 undefined 键的对象
 *
 * @category Object
 * @example
 * ```ts
 * const obj = { a: 1, b: undefined }
 * clearUndefined(obj) // { a: 1 }
 * ```
 */
export function clearUndefined<T extends object>(obj: T): T {
  for (const key of Object.keys(obj)) {
    // @ts-expect-error
    if (obj[key] === undefined) {
      del(obj, key)
    }
  }
  return obj
}

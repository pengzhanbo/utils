import type { Arrayable } from '../types'
import { del } from '../_internal/reflect'
import { isArray } from '../predicate'

/**
 * Delete keys from object
 *
 * Use `Reflect.deleteProperty` to remove a specified key from an object, rather than using the `delete` operator.
 *
 * 从对象中删除指定的键
 *
 * 使用 `Reflect.deleteProperty` 从对象中删除指定的键，而不是使用 `delete` 操作符。
 *
 * @param obj - The object to delete keys from 要从中删除键的对象
 * @param key - The keys to delete 要删除的键
 * @returns Whether any keys were deleted 是否成功删除了键
 *
 * @category Object
 * @example
 * ```ts
 * const obj = { a: 1, b: 2 }
 * deleteKey(obj, 'a') // true
 * deleteKey(obj, ['b', 'c']) // true
 * ```
 */
export function deleteKey<T extends object, K extends keyof T>(obj: T, key: Arrayable<K>): boolean {
  if (isArray(key)) {
    if (!key.length) {
      return false
    }
    let bool = false
    for (const k of key) {
      del(obj, k)
      bool = true
    }
    return bool
  } else {
    return del(obj, key)
  }
}

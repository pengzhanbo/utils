import { isKeyof } from '../predicate'

/**
 * Creates a new object with specified keys omitted.
 *
 * 创建一个新对象，省略指定的键。
 *
 * @category Object
 *
 * @param obj - The source object. 源对象
 * @param keys - The keys to omit. 要省略的键
 * @returns A new object with the specified keys omitted. 省略了指定键的新对象
 *
 * @example
 * ```ts
 * omit({ a: 1, b: 2 }, ['a']) // => { b: 2 }
 * ```
 */
export function omit<T extends Record<PropertyKey, any>, K extends keyof T = keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const res = Object.create(Object.getPrototypeOf(obj))
  Object.assign(res, obj)

  for (const key of keys) {
    if (isKeyof(obj, key)) delete res[key]
  }

  return res
}

import { isKeyof } from '../predicate'
import { objectKeys } from './keys'

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

/**
 * Creates a new object with properties that do not satisfy the predicate.
 *
 * 创建一个新对象，排除满足 predicate 的属性
 *
 * @category Object
 *
 * @param obj - The source object. 源对象
 * @param predicate - The predicate function. 谓词函数
 * @returns A new object without properties that satisfy the predicate. 排除满足谓词属性的新对象
 *
 * @example
 * ```ts
 * omitBy({ a: 1, b: 2, c: 3 }, (v) => v > 1) // => { a: 1 }
 * ```
 */
export function omitBy<T extends Record<PropertyKey, any>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  const res: Partial<T> = Object.create(Object.getPrototypeOf(obj))

  for (const key of objectKeys(obj)) {
    if (isKeyof(obj, key) && !predicate(obj[key], key)) res[key] = obj[key]
  }

  return res
}

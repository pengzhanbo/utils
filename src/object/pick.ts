import { hasOwn } from './has-own'
import { objectKeys } from './keys'

/**
 * Creates a new object composed of the picked object properties.
 *
 * 创建一个由所选对象属性组成的新对象。
 *
 * @category Object
 *
 * @see {@link omit} and {@link omitBy} — for the inverse operation
 * @see {@link omit} 和 {@link omitBy} — 反向操作
 *
 * @param obj - The source object. 源对象
 * @param keys - The keys to pick. 要选择的键
 * @returns A new object with only the picked properties. 仅包含所选属性的新对象
 *
 * @example
 * ```ts
 * pick({ a: 1, b: 2 }, ['a']) // => { a: 1 }
 * ```
 * @typeParam T - The type of elements in the array / 数组元素的类型
 */
export function pick<T extends Record<PropertyKey, any>, K extends keyof T = keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  const res = Object.create(Object.getPrototypeOf(obj)) as Pick<T, K>

  for (const key of keys) {
    if (hasOwn(obj, key)) res[key] = obj[key]
  }

  return res
}

/**
 * Creates a new object with properties that satisfy the predicate.
 *
 * 创建一个新对象，仅包含满足 predicate 的属性
 *
 * @category Object
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 * @param obj - The source object. 源对象
 * @param predicate - The predicate function. 谓词函数
 * @returns A new object with properties that satisfy the predicate. 满足谓词的新对象
 *
 * @example
 * ```ts
 * pickBy({ a: 1, b: 2, c: 3 }, (v) => v > 1) // => { b: 2, c: 3 }
 * ```
 */
export function pickBy<T extends Record<PropertyKey, any>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  const res: Partial<T> = Object.create(Object.getPrototypeOf(obj))

  for (const key of objectKeys(obj)) {
    if (predicate(obj[key], key)) res[key] = obj[key]
  }

  return res
}

import { isKeyof } from '../predicate'

/**
 * Creates a new object composed of the picked object properties.
 *
 * 创建一个由所选对象属性组成的新对象。
 *
 * @category Object
 *
 * @param obj - The source object. 源对象
 * @param keys - The keys to pick. 要选择的键
 * @returns A new object with only the picked properties. 仅包含所选属性的新对象
 *
 * @example
 * ```ts
 * pick({ a: 1, b: 2 }, ['a']) // => { a: 1 }
 * ```
 */
export function pick<T extends Record<PropertyKey, any>, K extends keyof T = keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const res = Object.create(Object.getPrototypeOf(obj)) as Pick<T, K>

  for (const key of keys) {
    if (isKeyof(obj, key)) res[key] = obj[key]
  }

  return res
}

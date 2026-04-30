/**
 * Check if an object has a property.
 *
 * 检查一个对象是否有属性。
 *
 * @category Predicate
 *
 * @typeParam T - The type of elements in the array / 数组元素的类型
 *
 * @param obj - The object to check. 要检查的对象
 * @param key - The key to check for. 要检查的键
 *
 * @returns True if the object has the property, false otherwise. 如果对象具有该属性则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isKeyof({ a: 1, b: 2 }, 'a') // => true
 * isKeyof({ a: 1, b: 2 }, 'c') // => false
 * ```
 */
export function isKeyof<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj
}

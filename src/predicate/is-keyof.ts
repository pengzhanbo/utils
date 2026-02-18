/**
 * Check if an object has a property
 *
 * 检查一个对象是否有属性
 *
 * @category Predicate
 *
 * @param obj - The object to check. 要检查的对象
 * @param key - The key to check for. 要检查的键
 * @returns True if the object has the property, false otherwise. 如果对象具有该属性则返回true，否则返回false
 */
export function isKeyof<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj
}

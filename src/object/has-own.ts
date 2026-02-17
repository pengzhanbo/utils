const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * Check if an object has a non-inherited property
 *
 * 检查一个对象是否具有非继承属性
 *
 * @category Object
 *
 * @param obj - The object to check. 要检查的对象
 * @param key - The key to check for. 要检查的键
 * @returns True if the object has the own property, false otherwise. 如果对象具有该自有属性则返回true，否则返回false
 */
export function hasOwn<T>(obj: T, key: keyof any): key is keyof T {
  return obj === null ? false : hasOwnProperty.call(obj, key)
}

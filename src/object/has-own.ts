const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * Check if an object has a non-inherited property
 *
 * 检查一个对象是否具有非继承属性
 *
 * @category Object
 */
export function hasOwn<T>(obj: T, key: keyof any): key is keyof T {
  return obj === null ? false : hasOwnProperty.call(obj, key)
}

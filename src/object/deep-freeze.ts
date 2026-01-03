import { isArray, isPlainObject } from '../is'

/**
 * Freeze an object recursively and its properties
 *
 * 递归冻结一个对象及其属性
 *
 * @category Object
 */
export function deepFreeze<T>(obj: T): T {
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      deepFreeze(obj[i])
    }
  }
  else if (isPlainObject(obj)) {
    Object.freeze(obj)

    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      deepFreeze(obj[keys[i]!])
    }
  }
  return obj
}

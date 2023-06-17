import { isArray, isObject } from './is'

/**
 *
 * @category Object
 */
export function hasOwn<T>(obj: T, key: string) {
  return obj === null ? false : Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 *
 * @category Object
 */
export function deepFreeze<T>(obj: T): T {
  if (isArray(obj)) {
    obj.forEach((item) => deepFreeze(item))
  } else if (isObject(obj)) {
    Object.freeze(obj)
    Object.keys(obj).forEach((key) => deepFreeze(obj[key] as any))
  }
  return obj
}

/**
 * @category Object
 */
export function isKeyof<T extends object>(
  obj: T,
  key: keyof any,
): key is keyof T {
  return key in obj
}

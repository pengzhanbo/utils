/**
 * Object Helpers
 *
 * @module Object
 */

import type { DeepMerge, ObjectGet, ObjectKeyPaths } from './types'
import { isArray, isPlainObject } from './is'

/**
 * Check if an object has a non-inherited property
 *
 * 检查一个对象是否具有非继承属性
 *
 * @category Object
 */
export function hasOwn<T>(obj: T, key: keyof any): key is keyof T {
  return obj === null ? false : Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * Freeze an object recursively and its properties
 *
 * 递归冻结一个对象及其属性
 *
 * @category Object
 */
export function deepFreeze<T>(obj: T): T {
  if (isArray(obj)) {
    obj.forEach(item => deepFreeze(item))
  }
  else if (isPlainObject(obj)) {
    Object.freeze(obj)
    Object.keys(obj).forEach(key => deepFreeze(obj[key] as any))
  }
  return obj
}

/**
 * Check if an object has a property
 *
 * 检查一个对象是否有属性
 *
 * @category Object
 */
export function isKeyof<T extends object>(
  obj: T,
  key: keyof any,
): key is keyof T {
  return key in obj
}

/**
 * Get a value from an object
 *
 * 从一个对象中获取一个值
 *
 * @category Object
 * @example
 * ```ts
 * objectGet({ a: 1 }, 'a') // => 1
 * objectGet({ a: { b: 2 } }, 'a.b') // => 2
 * objectGet({ a: [{ b: 2 }] }, 'a[0].b') // => 2
 * ```
 */
export function objectGet<
  T extends Record<PropertyKey, any>,
  P extends ObjectKeyPaths<T>,
>(source: T, path: P): ObjectGet<T, P> {
  const keys = path.replace(/\[['"]?(.+?)['"]?\]/g, '.$1').split('.')
  let res: any = source
  for (const k of keys)
    res = res?.[k]

  return res
}

/**
 * Creates a new object with specified keys omitted.
 *
 * 创建一个新对象，省略指定的键。
 *
 * @category Object
 * @example
 * ```ts
 * omit({ a: 1, b: 2 }, ['a']) // => { b: 2 }
 * ```
 */
export function omit<T extends object = object, K extends keyof T = keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const res = { ...obj }

  for (const key of keys) {
    if (isKeyof(obj, key))
      delete res[key]
  }

  return res
}

/**
 * Creates a new object composed of the picked object properties.
 *
 * 创建一个由所选对象属性组成的新对象。
 *
 * @category Object
 * @example
 * ```ts
 * pick({ a: 1, b: 2 }, ['a']) // => { a: 1 }
 * ```
 */
export function pick<T extends object = object, K extends keyof T = keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const res = {} as Pick<T, K>

  for (const key of keys) {
    if (isKeyof(obj, key))
      res[key] = obj[key]
  }

  return res
}

/**
 * Deep merge
 *
 * The first argument is the target object, the rest are the sources.
 * The target object will be mutated and returned.
 *
 * 深度合并
 *
 * 第一个参数是目标对象，其余的是源对象。
 * 目标对象将被修改并返回。
 *
 * @category Object
 */
export function deepMerge<T extends object = object, S extends object = T>(
  target: T,
  ...sources: S[]
): DeepMerge<T, S> {
  if (!sources.length)
    return target as any

  const source = sources.shift()
  if (source === undefined)
    return target as any

  if (isMergableObject(target) && isMergableObject(source)) {
    Object.keys(source).forEach((key) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype')
        return

      // @ts-expect-error source[key] can be any
      if (isMergableObject(source[key])) {
        // @ts-expect-error target[key] can be any
        if (!target[key])
          // @ts-expect-error target[key] can be any
          target[key] = {}

        // @ts-expect-error target[key] can be any
        deepMerge(target[key], source[key])
      }
      else {
        // @ts-expect-error target[key] can be any
        target[key] = source[key]
      }
    })
  }

  return deepMerge(target, ...sources)
}

/**
 * Deep merge
 *
 * Differs from `deepMerge` in that it merges arrays instead of overriding them.
 *
 * The first argument is the target object, the rest are the sources.
 * The target object will be mutated and returned.
 *
 * 深度合并
 *
 * 与 `deepMerge` 不同，它合并数组而不是覆盖它们。
 *
 * 第一个参数是目标对象，其余的是源。
 * 目标对象将被修改并返回。
 *
 * @category Object
 */
export function deepMergeWithArray<
  T extends object = object,
  S extends object = T,
>(target: T, ...sources: S[]): DeepMerge<T, S> {
  if (!sources.length)
    return target as any

  const source = sources.shift()
  if (source === undefined)
    return target as any

  if (Array.isArray(target) && Array.isArray(source))
    target.push(...source)

  if (isMergableObject(target) && isMergableObject(source)) {
    Object.keys(source).forEach((key) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype')
        return

      // @ts-expect-error source[key] can be any
      if (Array.isArray(source[key])) {
        // @ts-expect-error source[key] can be any
        if (!target[key])
          // @ts-expect-error source[key] can be any
          target[key] = []

        // @ts-expect-error source[key] can be any
        deepMergeWithArray(target[key], source[key])
      }

      // @ts-expect-error source[key] can be any
      else if (isMergableObject(source[key])) {
        // @ts-expect-error source[key] can be any
        if (!target[key])
          // @ts-expect-error source[key] can be any
          target[key] = {}

        // @ts-expect-error source[key] can be any
        deepMergeWithArray(target[key], source[key])
      }
      else {
        // @ts-expect-error source[key] can be any
        target[key] = source[key]
      }
    })
  }

  return deepMergeWithArray(target, ...sources)
}

function isMergableObject(item: any): item is object {
  return isPlainObject(item) && !Array.isArray(item)
}

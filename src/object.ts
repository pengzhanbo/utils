import { isArray, isObject } from './is.js'
import type { DeepMerge, ObjectGet, ObjectKeyPaths } from './types.js'

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

/**
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
  for (const k of keys) {
    res = res?.[k]
  }
  return res
}

/**
 * Deep merge
 *
 * The first argument is the target object, the rest are the sources.
 * The target object will be mutated and returned.
 *
 * @category Object
 */
export function deepMerge<T extends object = object, S extends object = T>(
  target: T,
  ...sources: S[]
): DeepMerge<T, S> {
  if (!sources.length) return target as any

  const source = sources.shift()
  if (source === undefined) return target as any

  if (isMergableObject(target) && isMergableObject(source)) {
    Object.keys(source).forEach((key) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype')
        return

      // @ts-expect-error
      if (isMergableObject(source[key])) {
        // @ts-expect-error
        if (!target[key])
          // @ts-expect-error
          target[key] = {}

        // @ts-expect-error
        deepMerge(target[key], source[key])
      } else {
        // @ts-expect-error
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
 * @category Object
 */
export function deepMergeWithArray<
  T extends object = object,
  S extends object = T,
>(target: T, ...sources: S[]): DeepMerge<T, S> {
  if (!sources.length) return target as any

  const source = sources.shift()
  if (source === undefined) return target as any

  if (Array.isArray(target) && Array.isArray(source)) target.push(...source)

  if (isMergableObject(target) && isMergableObject(source)) {
    Object.keys(source).forEach((key) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype')
        return

      // @ts-expect-error
      if (Array.isArray(source[key])) {
        // @ts-expect-error
        if (!target[key])
          // @ts-expect-error
          target[key] = []

        // @ts-expect-error
        deepMergeWithArray(target[key], source[key])
        // eslint-disable-next-line @typescript-eslint/brace-style
      }

      // @ts-expect-error
      else if (isMergableObject(source[key])) {
        // @ts-expect-error
        if (!target[key])
          // @ts-expect-error
          target[key] = {}

        // @ts-expect-error
        deepMergeWithArray(target[key], source[key])
      } else {
        // @ts-expect-error
        target[key] = source[key]
      }
    })
  }

  return deepMergeWithArray(target, ...sources)
}

function isMergableObject(item: any): item is Object {
  return isObject(item) && !Array.isArray(item)
}

import { isPlainObject } from '../is'

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
export function deepMerge<
  T extends Record<PropertyKey, any>,
  S extends Record<PropertyKey, any> = T,
>(
  target: T,
  ...sources: S[]
): DeepMerge<T, S> {
  if (!sources.length)
    return target as any

  const source = sources.shift()
  if (source === undefined)
    return target as any

  if (isMergableObject(target) && isMergableObject(source)) {
    const keys = Object.keys(source)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (key === '__proto__' || key === 'constructor' || key === 'prototype')
        continue

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
    }
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
  T extends Record<PropertyKey, any>,
  S extends Record<PropertyKey, any> = T,
>(target: T, ...sources: S[]): DeepMerge<T, S> {
  if (!sources.length)
    return target as any

  const source = sources.shift()
  if (source === undefined)
    return target as any

  if (Array.isArray(target) && Array.isArray(source))
    target.push(...source)

  if (isMergableObject(target) && isMergableObject(source)) {
    const keys = Object.keys(source)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (key === '__proto__' || key === 'constructor' || key === 'prototype')
        continue

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
    }
  }

  return deepMergeWithArray(target, ...sources)
}

function isMergableObject(item: any): item is object {
  return isPlainObject(item) && !Array.isArray(item)
}

type MergeInsertions<T> = T extends object
  ? { [K in keyof T]: MergeInsertions<T[K]> }
  : T

/**
 * Deep merge
 */
type DeepMerge<F, S> = MergeInsertions<{
  [K in keyof F | keyof S]: K extends keyof S & keyof F
    ? DeepMerge<F[K], S[K]>
    : K extends keyof S
      ? S[K]
      : K extends keyof F
        ? F[K]
        : never
}>

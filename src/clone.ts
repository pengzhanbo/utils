/**
 * clone data
 *
 * 克隆数据
 *
 * @module Clone
 */

import { isArray, isPlainObject } from './is'

/**
 * simple clone, use JSON.parse and JSON.stringify
 *
 * 简单的克隆,使用 JSON.parse 和 JSON.stringify
 * @category Clone
 */
export function simpleClone<T = any>(source: T): T {
  return JSON.parse(JSON.stringify(source))
}

/**
 * shallow clone, only clone the first level
 *
 * 浅克隆,只克隆第一层
 *
 * @category Clone
 */
export function shallowClone<T = any>(source: T): T {
  if (isPlainObject(source)) {
    const target = {} as Record<PropertyKey, any>
    for (const [, key] of [
      ...Object.keys(source),
      ...Object.getOwnPropertySymbols(source),
    ].entries())
      target[key] = source[key]

    return target as T
  }
  if (isArray(source))
    return [...source] as T

  return simpleClone(source)
}

/**
 * Deep Clone.
 *
 * 深度克隆
 *
 * @category Clone
 */
export function deepClone<T = any>(source: T): T {
  return deepCloneImpl(source)
}

function deepCloneImpl<T>(source: T, seen = new WeakMap<object, unknown>()): T {
  let target: T
  if (isPlainObject(source))
    target = Object.create(source.constructor.prototype)

  if (isArray(source))
    target = [] as T
  else
    return source

  if (seen.has(source))
    return seen.get(source) as T

  seen.set(source, target)

  const keys = [...Object.keys(source), ...Object.getOwnPropertySymbols(source)]

  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    const value = source[key as any]
    ;(target as Record<string, unknown>)[key as any]
      = isPlainObject(value) || isArray(value) ? deepCloneImpl(value, seen) : value
  }

  return target
}

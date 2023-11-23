import { isArray, isObject } from './is'

/**
 * simple clone, use JSON.parse and JSON.stringify
 * @category Clone
 */
export function simpleClone<T = any>(source: T): T {
  return JSON.parse(JSON.stringify(source))
}

/**
 * shallow clone
 * @category Clone
 */
export function shallowClone<T = any>(source: T): T {
  if (isObject(source)) {
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
 * deep clone
 * @category Clone
 */
export function deepClone<T = any>(source: T): T {
  return _deepClone(source)
}

function _deepClone<T>(source: T, seen = new WeakMap<object, unknown>()): T {
  let target: T
  if (isObject(source))
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
      = isObject(value) || isArray(value) ? _deepClone(value, seen) : value
  }

  return target
}

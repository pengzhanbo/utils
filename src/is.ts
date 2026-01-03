/**
 * Predicate helpers
 *
 * @module Predicate
 */

import type { Finite, Integer } from './types'
import { toString } from './guard'

export function typeOf(s: unknown): string {
  return s === null
    ? 'null'
    : typeof s === 'object' || typeof s === 'function'
      ? toString(s).slice(8, -1).toLowerCase()
      : typeof s
}

/**
 * Checks if a value is of a given type
 *
 * 检查值是否为给定类型
 *
 * @category Common
 * @example
 * ```ts
 * isTypeof(null, 'null') // => true
 * isTypeof(undefined, 'undefined') // => true
 * isTypeof({}, 'object') // => true
 * ```
 */
export function isTypeof(s: unknown, type: string): boolean {
  return typeOf(s) === type
}

/**
 * Checks if the input is defined
 * @category Predicate
 */
export function isDef<T = any>(v?: T): v is T {
  return typeof v !== 'undefined'
}

/**
 * Checks if the input is a primitive
 * @category Predicate
 */
export function isPrimitive(v: unknown): v is null | undefined | boolean | number | string | symbol | bigint {
  return v === null || (typeof v !== 'object' && typeof v !== 'function')
}

/**
 * Checks if the input is a boolean
 * @category Predicate
 */
export function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean'
}

/**
 * Checks if the input is a function.
 * @category Predicate
 */
export function isFunction<T extends (...args: any[]) => any>(v: unknown): v is T {
  return typeof v === 'function'
}

/**
 * Checks if the input is a number
 * @category Predicate
 */
export function isNumber(v: unknown): v is number {
  return typeof v === 'number'
}

/**
 * Checks if the input is a string
 * @category Predicate
 */
export function isString(v: unknown): v is string {
  return typeof v === 'string'
}

/**
 * Checks if the input is a symbol
 * @category Predicate
 */
export function isSymbol(v: unknown): v is symbol {
  return typeof v === 'symbol'
}

/**
 * Checks if the input is an object
 * @category Predicate
 */
export function isPlainObject(v: unknown): v is Record<PropertyKey, unknown> {
  return isTypeof(v, 'object')
}

/**
 * Checks if the input is an array
 * @category Predicate
 */
export function isArray<T>(v: unknown): v is T[] {
  return Array.isArray(v)
}

/**
 * Checks if the input is undefined
 *
 * @category Predicate
 */
export function isUndefined(v: unknown): v is undefined {
  return typeof v === 'undefined'
}

/**
 * Checks if the input is null
 * @category Predicate
 */
export function isNull(v: unknown): v is null {
  return isTypeof(v, 'null')
}

/**
 * Checks if the input is a regexp
 * @category Predicate
 */
export function isRegexp(v: unknown): v is RegExp {
  return isTypeof(v, 'regexp')
}

/**
 * Checks if the input is a date
 * @category Predicate
 */
export function isDate(v: unknown): v is Date {
  return isTypeof(v, 'date')
}

/**
 * Check if an object has a property
 *
 * 检查一个对象是否有属性
 *
 * @category Predicate
 */
export function isKeyof<T extends object>(
  obj: T,
  key: PropertyKey,
): key is keyof T {
  return key in obj
}

/**
 * Checks if the input is an empty object
 * @category Predicate
 */
export function isEmptyObject(v: unknown): boolean {
  if (!isPlainObject(v))
    return false
  // eslint-disable-next-line no-unreachable-loop
  for (const _ in v)
    return false

  return true
}

/**
 * Checks if the input is a blob
 * @category Predicate
 */
export function isBlob(v: unknown): v is Blob {
  /* istanbul ignore if -- @preserve */
  if (typeof Blob === 'undefined')
    return false

  return v instanceof Blob
}

/**
 * Checks if the input is a typed array
 * @category Predicate
 */
export function isTypedArray(v: unknown): v is Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array {
  return ArrayBuffer.isView(v) && !(v instanceof DataView)
}

/**
 * Checks if the input is a window
 * @category Predicate
 */
export function isWindow(): boolean {
  /* istanbul ignore next -- @preserve */
  return typeof window !== 'undefined' && isTypeof(window, 'window')
}

/**
 * Checks if the input is a browser
 * @category Predicate
 */
export function isBrowser(): boolean {
  /* istanbul ignore next -- @preserve */
  return typeof window !== 'undefined' && window.document != null
}

/**
 * Checks if a value is a JSON object.
 * @category Predicate
 */
export function isJSONObject(obj: unknown): obj is Record<string, any> {
  if (!isPlainObject(obj)) {
    return false
  }

  const keys = Reflect.ownKeys(obj)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!
    const value = obj[key]

    /* istanbul ignore if -- @preserve */
    if (typeof key !== 'string') {
      return false
    }

    if (!isJSONValue(value)) {
      return false
    }
  }

  return true
}

/**
 * Checks if a given value is a valid JSON array.
 * @category Predicate
 */
export function isJSONArray(value: unknown): value is any[] {
  if (!Array.isArray(value)) {
    return false
  }

  return value.every(item => isJSONValue(item))
}

/**
 * Checks if a given value is a valid JSON value.
 * @category Predicate
 */
export function isJSONValue(value: unknown): value is Record<string, any> | any[] | string | number | boolean | null {
  switch (typeof value) {
    case 'object': {
      return value === null || isJSONArray(value) || isJSONObject(value)
    }
    case 'string':
    case 'number':
    case 'boolean':
      return true

    default:
      return false
  }
}

/**
 * Checks if the input is an integer
 *
 * 检查输入是否为整数
 *
 * @category Predicate
 *
 * @example
 * ```ts
 * isInteger(1) // => true
 * isInteger(1.1) // => false
 * ```
 */
export function isInteger<T>(v: T): v is Integer<T> {
  return Number.isInteger(v)
}

/**
 * A strongly-typed version of `Number.isSafeInteger()`.
 *
 * `Number.isSafeInteger()` 的强类型版本。
 *
 * @category Predicate
 *
 * @example
 * ```ts
 * isSafeInteger(1) // => true
 * isSafeInteger(1.1) // => false
 * ```
 */
export function isSafeInteger<T>(v: T): v is Integer<T> {
  return Number.isSafeInteger(v)
}

/**
 * A strongly-typed version of `Number.isFinite()`.
 *
 * `Number.isFinite()` 的强类型版本。
 *
 * @category Predicate
 *
 * @example
 * ```ts
 * isFinite(1) // => true
 * isFinite(Number.INFINITY) // => true
 * ```
 */
export function isFinite<T extends number>(v: T): v is Finite<T> {
  return Number.isFinite(v)
}

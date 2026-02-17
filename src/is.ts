/**
 * Predicate helpers
 *
 * @module Predicate
 */

import type { Finite, Integer } from './types'
import {
  T_BOOLEAN,
  T_DATE,
  T_FUNCTION,
  T_NULL,
  T_NUMBER,
  T_OBJECT,
  T_REGEXP,
  T_STRING,
  T_SYMBOL,
  T_UNDEFINED,
} from './_internal/tags'
import { toString } from './guard'

/**
 * Get the type of a value
 *
 * 获取值的类型
 *
 * @category Common
 *
 * @param s - The value to get the type of. 要获取类型的值
 * @returns The type of the value as a string. 值的类型字符串
 */
export function typeOf(s: unknown): string {
  const type = typeof s
  return s === null
    ? T_NULL
    : type === T_OBJECT || type === T_FUNCTION
      ? toString(s).slice(8, -1).toLowerCase()
      : type
}

/**
 * Checks if a value is of a given type
 *
 * 检查值是否为给定类型
 *
 * @category Common
 *
 * @param s - The value to check. 要检查的值
 * @param type - The type to check against. 要检查的类型
 * @returns True if the value is of the given type, false otherwise. 如果值为给定类型则返回true，否则返回false
 *
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
 *
 * 检查输入是否已定义
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is defined, false otherwise. 如果值已定义则返回true，否则返回false
 */
export function isDef<T = any>(v?: T): v is T {
  return !isTypeof(v, T_UNDEFINED)
}

/**
 * Checks if the input is a primitive
 *
 * 检查输入是否为原始值
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a primitive, false otherwise. 如果值为原始值则返回true，否则返回false
 */
export function isPrimitive(
  v: unknown,
): v is null | undefined | boolean | number | string | symbol | bigint {
  // oxlint-disable-next-line valid-typeof
  return v === null || (typeof v !== T_OBJECT && typeof v !== T_FUNCTION)
}

/**
 * Checks if the input is a boolean
 *
 * 检查输入是否为布尔值
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a boolean, false otherwise. 如果值为布尔值则返回true，否则返回false
 */
export function isBoolean(v: unknown): v is boolean {
  return isTypeof(v, T_BOOLEAN)
}

/**
 * Checks if the input is a function.
 *
 * 检查输入是否为函数
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a function, false otherwise. 如果值为函数则返回true，否则返回false
 */
export function isFunction<T extends (...args: any[]) => any>(v: unknown): v is T {
  // eslint-disable-next-line valid-typeof
  return typeof v === T_FUNCTION
}

/**
 * Checks if the input is a number
 *
 * 检查输入是否为数字
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a number, false otherwise. 如果值为数字则返回true，否则返回false
 */
export function isNumber(v: unknown): v is number {
  return isTypeof(v, T_NUMBER)
}

/**
 * Checks if the input is a string
 *
 * 检查输入是否为字符串
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a string, false otherwise. 如果值为字符串则返回true，否则返回false
 */
export function isString(v: unknown): v is string {
  return isTypeof(v, T_STRING)
}

/**
 * Checks if the input is a symbol
 *
 * 检查输入是否为符号
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a symbol, false otherwise. 如果值为符号则返回true，否则返回false
 */
export function isSymbol(v: unknown): v is symbol {
  return isTypeof(v, T_SYMBOL)
}

/**
 * Checks if the input is an object
 *
 * 检查输入是否为对象
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is an object, false otherwise. 如果值为对象则返回true，否则返回false
 */
export function isPlainObject(v: unknown): v is Record<PropertyKey, unknown> {
  return isTypeof(v, T_OBJECT)
}

/**
 * Checks if the input is an array
 *
 * 检查输入是否为数组
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is an array, false otherwise. 如果值为数组则返回true，否则返回false
 */
export function isArray<T>(v: unknown): v is T[] {
  return Array.isArray(v)
}

/**
 * Checks if the input is undefined
 *
 * 检查输入是否为undefined
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is undefined, false otherwise. 如果值为undefined则返回true，否则返回false
 */
export function isUndefined(v: unknown): v is undefined {
  return isTypeof(v, T_UNDEFINED)
}

/**
 * Checks if the input is null
 *
 * 检查输入是否为null
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is null, false otherwise. 如果值为null则返回true，否则返回false
 */
export function isNull(v: unknown): v is null {
  return isTypeof(v, T_NULL)
}

/**
 * Checks if the input is a regexp
 *
 * 检查输入是否为正则表达式
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a regexp, false otherwise. 如果值为正则表达式则返回true，否则返回false
 */
export function isRegexp(v: unknown): v is RegExp {
  return isTypeof(v, T_REGEXP)
}

/**
 * Checks if the input is a date
 *
 * 检查输入是否为日期
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a date, false otherwise. 如果值为日期则返回true，否则返回false
 */
export function isDate(v: unknown): v is Date {
  return isTypeof(v, T_DATE)
}

/**
 * Check if an object has a property
 *
 * 检查一个对象是否有属性
 *
 * @category Predicate
 *
 * @param obj - The object to check. 要检查的对象
 * @param key - The key to check for. 要检查的键
 * @returns True if the object has the property, false otherwise. 如果对象具有该属性则返回true，否则返回false
 */
export function isKeyof<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj
}

/**
 * Checks if the input is an empty object
 *
 * 检查输入是否为空对象
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is an empty object, false otherwise. 如果值为空对象则返回true，否则返回false
 */
export function isEmptyObject(v: unknown): boolean {
  if (!isPlainObject(v)) return false
  for (const _ in v) return false

  return true
}

/**
 * Checks if the input is a blob
 *
 * 检查输入是否为Blob
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a blob, false otherwise. 如果值为Blob则返回true，否则返回false
 */
export function isBlob(v: unknown): v is Blob {
  /* istanbul ignore if -- @preserve */
  // eslint-disable-next-line valid-typeof
  if (typeof Blob === T_UNDEFINED) return false

  return v instanceof Blob
}

/**
 * Checks if the input is a typed array
 *
 * 检查输入是否为类型化数组
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a typed array, false otherwise. 如果值为类型化数组则返回true，否则返回false
 */
export function isTypedArray(
  v: unknown,
): v is
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array {
  return ArrayBuffer.isView(v) && !(v instanceof DataView)
}

declare let Buffer: undefined | typeof globalThis.Buffer

/**
 * Checks if the input is a buffer
 *
 * 检查输入是否为Buffer
 *
 * @category Predicate
 *
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a buffer, false otherwise. 如果值为Buffer则返回true，否则返回false
 */
export function isBuffer(v: unknown): boolean {
  /* istanbul ignore next -- @preserve */
  // eslint-disable-next-line valid-typeof
  return typeof Buffer !== T_UNDEFINED && Buffer!.isBuffer(v)
}

/**
 * Checks if the input is a window
 *
 * 检查是否在浏览器窗口环境中
 *
 * @category Predicate
 *
 * @returns True if in a window environment, false otherwise. 如果在窗口环境中则返回true，否则返回false
 */
export function isWindow(): boolean {
  /* istanbul ignore next -- @preserve */
  // eslint-disable-next-line valid-typeof
  return typeof window !== T_UNDEFINED && isTypeof(window, 'window')
}

/**
 * Checks if the input is a browser
 *
 * 检查是否在浏览器环境中
 *
 * @category Predicate
 *
 * @returns True if in a browser environment, false otherwise. 如果在浏览器环境中则返回true，否则返回false
 */
export function isBrowser(): boolean {
  /* istanbul ignore next -- @preserve */
  // eslint-disable-next-line valid-typeof
  return typeof window !== T_UNDEFINED && window.document != null
}

/**
 * Checks if a value is a JSON object.
 *
 * 检查一个值是否为JSON对象
 *
 * @category Predicate
 *
 * @param obj - The value to check. 要检查的值
 * @returns True if the value is a JSON object, false otherwise. 如果值为JSON对象则返回true，否则返回false
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
    // eslint-disable-next-line valid-typeof
    if (typeof key !== T_STRING) {
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
 *
 * 检查给定值是否为有效的JSON数组
 *
 * @category Predicate
 *
 * @param value - The value to check. 要检查的值
 * @returns True if the value is a valid JSON array, false otherwise. 如果值是有效的JSON数组则返回true，否则返回false
 */
export function isJSONArray(value: unknown): value is any[] {
  if (!Array.isArray(value)) {
    return false
  }

  return value.every((item) => isJSONValue(item))
}

/**
 * Checks if a given value is a valid JSON value.
 *
 * 检查给定值是否为有效的JSON值
 *
 * @category Predicate
 *
 * @param value - The value to check. 要检查的值
 * @returns True if the value is a valid JSON value, false otherwise. 如果值是有效的JSON值则返回true，否则返回false
 */
export function isJSONValue(
  value: unknown,
): value is Record<string, any> | any[] | string | number | boolean | null {
  switch (typeof value) {
    case T_OBJECT: {
      return value === null || isJSONArray(value) || isJSONObject(value)
    }
    case T_STRING:
    case T_NUMBER:
    case T_BOOLEAN:
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
 * @param v - The value to check. 要检查的值
 * @returns True if the value is an integer, false otherwise. 如果值为整数则返回true，否则返回false
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
 * @param v - The value to check. 要检查的值
 * @returns True if the value is a safe integer, false otherwise. 如果值为安全整数则返回true，否则返回false
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
 * @param v - The value to check. 要检查的值
 * @returns True if the value is finite, false otherwise. 如果值为有限数则返回true，否则返回false
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

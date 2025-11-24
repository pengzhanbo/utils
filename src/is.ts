/**
 * Type check
 *
 * @module Is
 */
import { getTypeName } from './common'

/**
 * Checks if the input is defined
 * @category Is
 */
export function isDef<T = any>(v?: T): v is T {
  return typeof v !== 'undefined'
}

/**
 * Checks if the input is a primitive
 * @category Is
 */
export function isPrimitive(v: unknown): v is null | undefined | boolean | number | string | symbol | bigint {
  return v === null || (typeof v !== 'object' && typeof v !== 'function')
}

/**
 * Checks if the input is a boolean
 * @category Is
 */
export function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean'
}

/**
 * Checks if the input is a function.
 * @category Is
 */
export function isFunction<T extends (...args: any[]) => any>(v: unknown): v is T {
  return typeof v === 'function'
}

/**
 * Checks if the input is a number
 * @category Is
 */
export function isNumber(v: unknown): v is number {
  return typeof v === 'number'
}

/**
 * Checks if the input is a string
 * @category Is
 */
export function isString(v: unknown): v is string {
  return typeof v === 'string'
}

/**
 * Checks if the input is a symbol
 * @category Is
 */
export function isSymbol(v: unknown): v is symbol {
  return typeof v === 'symbol'
}

/**
 * Checks if the input is an object
 * @category Is
 */
export function isPlainObject(v: unknown): v is Record<PropertyKey, unknown> {
  return getTypeName(v) === 'object'
}

/**
 * Checks if the input is an array
 * @category Is
 */
export function isArray<T>(v: unknown): v is T[] {
  return Array.isArray(v)
}

/**
 * Checks if the input is undefined
 */
export function isUndefined(v: unknown): v is undefined {
  return typeof v === 'undefined'
}

/**
 * Checks if the input is null
 * @category Is
 */
export function isNull(v: unknown): v is null {
  return getTypeName(v) === 'null'
}

/**
 * Checks if the input is a regexp
 * @category Is
 */
export function isRegexp(v: unknown): v is RegExp {
  return getTypeName(v) === 'regexp'
}

/**
 * Checks if the input is a date
 * @category Is
 */
export function isDate(v: unknown): v is Date {
  return getTypeName(v) === 'date'
}

/**
 * Checks if the input is an empty object
 * @category Is
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
 * @category Is
 */
export function isBlob(v: unknown): v is Blob {
  /* istanbul ignore if -- @preserve */
  if (typeof Blob === 'undefined')
    return false

  return v instanceof Blob
}

/**
 * Checks if the input is a typed array
 * @category Is
 */
export function isTypedArray(v: unknown): v is Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array {
  return ArrayBuffer.isView(v) && !(v instanceof DataView)
}

/**
 * Checks if the input is a window
 * @category Is
 */
export function isWindow(v: unknown): boolean {
  /* istanbul ignore next -- @preserve */
  return typeof v !== 'undefined' && getTypeName(v) === 'window'
}

/**
 * Checks if the input is a browser
 * @category Is
 */
export function isBrowser(): boolean {
  /* istanbul ignore next -- @preserve */
  return typeof window !== 'undefined'
}

/**
 * Checks if a value is a JSON object.
 * @category Is
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
 * @category Is
 */
export function isJSONArray(value: unknown): value is any[] {
  if (!Array.isArray(value)) {
    return false
  }

  return value.every(item => isJSONValue(item))
}

/**
 * Checks if a given value is a valid JSON value.
 * @category Is
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

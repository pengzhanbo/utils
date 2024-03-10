import { getTypeName } from './common'

/**
 * Checks if the input is defined
 */
export const isDef = <T = any>(v?: T): v is T => typeof v !== 'undefined'

/**
 * Checks if the input is a boolean
 */
export const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

/**
 * Checks if the input is a function.
 */
export function isFunction<T extends Function>(v: unknown): v is T {
  return typeof v === 'function'
}

/**
 * Checks if the input is a number
 */
export const isNumber = (v: unknown): v is number => typeof v === 'number'

/**
 * Checks if the input is a string
 */
export const isString = (v: unknown): v is string => typeof v === 'string'

/**
 * Checks if the input is a symbol
 */
export const isSymbol = (v: unknown): v is symbol => typeof v === 'symbol'

/**
 * Checks if the input is an object
 */
export function isObject(v: unknown): v is Record<PropertyKey, unknown> {
  return getTypeName(v) === 'object'
}

/**
 * Checks if the input is an array
 */
export const isArray = <T>(v: unknown): v is T[] => Array.isArray(v)

/**
 * Checks if the input is undefined
 */
export function isUndefined(v: unknown): v is undefined {
  return typeof v === 'undefined'
}

/**
 * Checks if the input is null
 */
export const isNull = (v: unknown): v is null => getTypeName(v) === 'null'

/**
 * Checks if the input is a regexp
 */
export const isRegexp = (v: unknown): v is RegExp => getTypeName(v) === 'regexp'

/**
 * Checks if the input is a date
 */
export const isDate = (v: unknown): v is Date => getTypeName(v) === 'date'

/**
 * Checks if the input is an empty object
 */
export function isEmptyObject(v: unknown): boolean {
  if (!isObject(v))
    return false
  // eslint-disable-next-line no-unreachable-loop
  for (const _ in v)
    return false

  return true
}

/**
 * Checks if the input is a window
 */
export function isWindow(v: unknown): boolean {
  return typeof v !== 'undefined' && getTypeName(v) === 'window'
}

/**
 * Checks if the input is a browser
 */
// @ts-expect-error 跳过环境检查
export const isBrowser = (): boolean => typeof window !== 'undefined'

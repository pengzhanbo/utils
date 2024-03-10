import { getTypeName } from './common'

/**
 * Checks if the input is defined
 * @category Is
 */
export function isDef<T = any>(v?: T): v is T {
  return typeof v !== 'undefined'
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
export function isFunction<T extends Function>(v: unknown): v is T {
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
export function isObject(v: unknown): v is Record<PropertyKey, unknown> {
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
  if (!isObject(v))
    return false
  // eslint-disable-next-line no-unreachable-loop
  for (const _ in v)
    return false

  return true
}

/**
 * Checks if the input is a window
 * @category Is
 */
export function isWindow(v: unknown): boolean {
  return typeof v !== 'undefined' && getTypeName(v) === 'window'
}

/**
 * Checks if the input is a browser
 * @category Is
 */
export function isBrowser(): boolean {
  // @ts-expect-error 跳过环境检查
  return typeof window !== 'undefined'
}

import { getTypeName } from './common'

export const isDef = <T = any>(v?: T): v is T => typeof v !== 'undefined'

export const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

export function isFunction<T extends Function>(v: unknown): v is T {
  return typeof v === 'function'
}

export const isNumber = (v: unknown): v is number => typeof v === 'number'

export const isString = (v: unknown): v is string => typeof v === 'string'

export const isSymbol = (v: unknown): v is symbol => typeof v === 'symbol'

export function isObject(v: unknown): v is Record<PropertyKey, unknown> {
  return getTypeName(v) === 'object'
}

export const isArray = <T>(v: unknown): v is T[] => Array.isArray(v)

export function isUndefined(v: unknown): v is undefined {
  return typeof v === 'undefined'
}

export const isNull = (v: unknown): v is null => getTypeName(v) === 'null'

export const isRegexp = (v: unknown): v is RegExp => getTypeName(v) === 'regexp'

export const isDate = (v: unknown): v is Date => getTypeName(v) === 'date'

export function isEmptyObject(v: unknown): boolean {
  if (!isObject(v))
    return false
  // eslint-disable-next-line no-unreachable-loop
  for (const _ in v)
    return false

  return true
}

export function isWindow(v: unknown) {
  return typeof v !== 'undefined' && getTypeName(v) === 'window'
}

// @ts-expect-error 跳过环境检查
export const isBrowser = () => typeof window !== 'undefined'

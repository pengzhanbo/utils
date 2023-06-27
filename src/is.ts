import { getTypeName } from './common'

export const isDef = <T = any>(v?: T): v is T => typeof v !== 'undefined'

export const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

export const isFunction = <T extends Function>(v: unknown): v is T =>
  typeof v === 'function'

export const isNumber = (v: unknown): v is number => typeof v === 'number'

export const isString = (v: unknown): v is string => typeof v === 'string'

export const isSymbol = (v: unknown): v is symbol => typeof v === 'symbol'

export const isObject = (v: unknown): v is Record<PropertyKey, unknown> =>
  getTypeName(v) === 'object'

export const isArray = <T>(v: unknown): v is T[] => Array.isArray(v)

export const isUndefined = (v: unknown): v is undefined =>
  typeof v === 'undefined'

export const isNull = (v: unknown): v is null => getTypeName(v) === 'null'

export const isRegexp = (v: unknown): v is RegExp => getTypeName(v) === 'regexp'

export const isDate = (v: unknown): v is Date => getTypeName(v) === 'date'

export const isEmptyObject = (v: unknown): boolean => {
  if (!isObject(v)) return false
  // eslint-disable-next-line no-unreachable-loop
  for (const _ in v) {
    return false
  }
  return true
}

export const isWindow = (v: unknown) =>
  typeof v !== 'undefined' && getTypeName(v) === 'window'

// @ts-ignore
export const isBrowser = () => typeof window !== 'undefined'

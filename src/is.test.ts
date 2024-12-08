import { expect, it } from 'vitest'
import { isArray, isBlob, isBoolean, isDate, isDef, isEmptyObject, isFunction, isJSONArray, isJSONObject, isJSONValue, isNull, isNumber, isPlainObject, isPrimitive, isRegexp, isString, isSymbol, isTypedArray, isUndefined } from './is'

it('isDef', () => {
  expect(isDef(undefined)).toBe(false)
  expect(isDef(null)).toBe(true)
  expect(isDef(1)).toBe(true)
  expect(isDef('1')).toBe(true)
  expect(isDef(true)).toBe(true)
  expect(isDef({})).toBe(true)
  expect(isDef(() => {})).toBe(true)
})

it('isPrimitive', () => {
  expect(isPrimitive(undefined)).toBe(true)
  expect(isPrimitive(null)).toBe(true)
  expect(isPrimitive(1)).toBe(true)
  expect(isPrimitive('1')).toBe(true)
  expect(isPrimitive(true)).toBe(true)
  expect(isPrimitive(false)).toBe(true)
  expect(isPrimitive({})).toBe(false)
  expect(isPrimitive([])).toBe(false)
  expect(isPrimitive(() => {})).toBe(false)
  expect(isPrimitive(Symbol(''))).toBe(true)
})

it('isBoolean', () => {
  expect(isBoolean(undefined)).toBe(false)
  expect(isBoolean(null)).toBe(false)
  expect(isBoolean(1)).toBe(false)
  expect(isBoolean('1')).toBe(false)
  expect(isBoolean(true)).toBe(true)
  expect(isBoolean(false)).toBe(true)
  expect(isBoolean({})).toBe(false)
  expect(isBoolean(() => {})).toBe(false)
})

it('isFunction', () => {
  expect(isFunction(undefined)).toBe(false)
  expect(isFunction(null)).toBe(false)
  expect(isFunction(1)).toBe(false)
  expect(isFunction('1')).toBe(false)
  expect(isFunction(true)).toBe(false)
  expect(isFunction(false)).toBe(false)
  expect(isFunction({})).toBe(false)
  expect(isFunction(() => {})).toBe(true)
  // eslint-disable-next-line prefer-arrow-callback
  expect(isFunction(function () {})).toBe(true)
})

it('isNumber', () => {
  expect(isNumber(undefined)).toBe(false)
  expect(isNumber(null)).toBe(false)
  expect(isNumber(1)).toBe(true)
  expect(isNumber('1')).toBe(false)
  expect(isNumber(true)).toBe(false)
  expect(isNumber(false)).toBe(false)
  expect(isNumber({})).toBe(false)
  expect(isNumber(() => {})).toBe(false)
})

it('isString', () => {
  expect(isString(undefined)).toBe(false)
  expect(isString(null)).toBe(false)
  expect(isString(1)).toBe(false)
  expect(isString('')).toBe(true)
  expect(isString('1')).toBe(true)
  expect(isString(true)).toBe(false)
  expect(isString(false)).toBe(false)
  expect(isString({})).toBe(false)
  expect(isString(() => {})).toBe(false)
})

it('isSymbol', () => {
  expect(isSymbol(undefined)).toBe(false)
  expect(isSymbol(null)).toBe(false)
  expect(isSymbol(1)).toBe(false)
  expect(isSymbol('1')).toBe(false)
  expect(isSymbol(true)).toBe(false)
  expect(isSymbol(false)).toBe(false)
  expect(isSymbol({})).toBe(false)
  expect(isSymbol(() => {})).toBe(false)
  expect(isSymbol(Symbol(''))).toBe(true)
})

it('isPlainObject', () => {
  expect(isPlainObject(undefined)).toBe(false)
  expect(isPlainObject(null)).toBe(false)
  expect(isPlainObject(1)).toBe(false)
  expect(isPlainObject('1')).toBe(false)
  expect(isPlainObject(true)).toBe(false)
  expect(isPlainObject(false)).toBe(false)
  expect(isPlainObject({})).toBe(true)
  expect(isPlainObject(() => {})).toBe(false)
  expect(isPlainObject(Object.create(null))).toBe(true)
  expect(isPlainObject(Object.create({}))).toBe(true)
})

it('isArray', () => {
  expect(isArray(undefined)).toBe(false)
  expect(isArray(null)).toBe(false)
  expect(isArray(1)).toBe(false)
  expect(isArray('1')).toBe(false)
  expect(isArray(true)).toBe(false)
  expect(isArray(false)).toBe(false)
  expect(isArray({})).toBe(false)
  expect(isArray(() => {})).toBe(false)
  expect(isArray([])).toBe(true)
  expect(isArray(Array.from({ length: 1 }))).toBe(true)
})

it('isUndefined', () => {
  expect(isUndefined(undefined)).toBe(true)
  expect(isUndefined(null)).toBe(false)
  expect(isUndefined(1)).toBe(false)
  expect(isUndefined('1')).toBe(false)
  expect(isUndefined(true)).toBe(false)
  expect(isUndefined(false)).toBe(false)
  expect(isUndefined({})).toBe(false)
  expect(isUndefined(() => {})).toBe(false)
})

it('isNull', () => {
  expect(isNull(undefined)).toBe(false)
  expect(isNull(null)).toBe(true)
  expect(isNull(1)).toBe(false)
  expect(isNull('1')).toBe(false)
  expect(isNull(true)).toBe(false)
  expect(isNull(false)).toBe(false)
  expect(isNull({})).toBe(false)
  expect(isNull(() => {})).toBe(false)
})

it('isRegexp', () => {
  expect(isRegexp(undefined)).toBe(false)
  expect(isRegexp(null)).toBe(false)
  expect(isRegexp(1)).toBe(false)
  expect(isRegexp('1')).toBe(false)
  expect(isRegexp(true)).toBe(false)
  expect(isRegexp(false)).toBe(false)
  expect(isRegexp({})).toBe(false)
  expect(isRegexp(() => {})).toBe(false)
  expect(isRegexp(/a/)).toBe(true)
  // eslint-disable-next-line prefer-regex-literals
  expect(isRegexp(new RegExp('a'))).toBe(true)
})

it('isDate', () => {
  expect(isDate(undefined)).toBe(false)
  expect(isDate(null)).toBe(false)
  expect(isDate(1)).toBe(false)
  expect(isDate('1')).toBe(false)
  expect(isDate(true)).toBe(false)
  expect(isDate(false)).toBe(false)
  expect(isDate({})).toBe(false)
  expect(isDate(() => {})).toBe(false)
  expect(isDate(new Date())).toBe(true)
})

it('isEmptyObject', () => {
  expect(isEmptyObject(undefined)).toBe(false)
  expect(isEmptyObject(null)).toBe(false)
  expect(isEmptyObject(1)).toBe(false)
  expect(isEmptyObject('1')).toBe(false)
  expect(isEmptyObject(true)).toBe(false)
  expect(isEmptyObject(false)).toBe(false)
  expect(isEmptyObject({})).toBe(true)
  expect(isEmptyObject({ a: 1 })).toBe(false)
})

it('isBlob', () => {
  expect(isBlob(undefined)).toBe(false)
  expect(isBlob(null)).toBe(false)
  expect(isBlob(1)).toBe(false)
  expect(isBlob('1')).toBe(false)
  expect(isBlob(true)).toBe(false)
  expect(isBlob(false)).toBe(false)
  expect(isBlob({})).toBe(false)
  expect(isBlob(() => {})).toBe(false)
  expect(isBlob(new Blob([]))).toBe(true)
})

it('isTypedArray', () => {
  expect(isTypedArray(new Uint8Array(new ArrayBuffer(8)))).toBe(true)
  expect(isTypedArray(new Uint8ClampedArray(new ArrayBuffer(8)))).toBe(true)
  expect(isTypedArray(new Uint16Array(new ArrayBuffer(8)))).toBe(true)
  expect(isTypedArray(new Uint32Array(new ArrayBuffer(8)))).toBe(true)
  expect(isTypedArray(new BigUint64Array(new ArrayBuffer(8)))).toBe(true)
  expect(isTypedArray(new Int8Array(new ArrayBuffer(8)))).toBe(true)
  expect(isTypedArray(new Int16Array(new ArrayBuffer(8)))).toBe(true)
  expect(isTypedArray(new Int32Array(new ArrayBuffer(8)))).toBe(true)
  expect(isTypedArray(new BigInt64Array(new ArrayBuffer(8)))).toBe(true)
  expect(isTypedArray(new Float32Array(new ArrayBuffer(8)))).toBe(true)
  expect(isTypedArray(new Float64Array(new ArrayBuffer(8)))).toBe(true)
  expect(isTypedArray(undefined)).toBe(false)
  expect(isTypedArray(new Map())).toBe(false)
  expect(isTypedArray(new Set())).toBe(false)
  expect(isTypedArray('')).toBe(false)
  expect(isTypedArray(Symbol(''))).toBe(false)
  expect(isTypedArray([1, 2, 3])).toBe(false)
  expect(isTypedArray(false)).toBe(false)
})

it('isJSONValue', () => {
  expect(isJSONValue(undefined)).toBe(false)
  expect(isJSONValue(null)).toBe(true)
  expect(isJSONValue(1)).toBe(true)
  expect(isJSONValue('1')).toBe(true)
  expect(isJSONValue(true)).toBe(true)
  expect(isJSONValue(false)).toBe(true)
  expect(isJSONValue({})).toBe(true)
  expect(isJSONValue(() => {})).toBe(false)
  expect(isJSONValue([])).toBe(true)
  expect(isJSONValue(new Date())).toBe(false)
})

it('isJSONArray', () => {
  expect(isJSONArray([])).toBe(true)
  expect(isJSONArray([1, 2, 3])).toBe(true)
  expect(isJSONArray(['1', '2', '3'])).toBe(true)
  expect(isJSONArray([true, false, true])).toBe(true)
  expect(isJSONArray([{}, {}, {}])).toBe(true)
  expect(isJSONArray([() => {}, () => {}, () => {}])).toBe(false)
  expect(isJSONArray([{}, { a: 1 }, {}])).toBe(true)
  expect(isJSONArray([{}, { a: 1 }, { a: () => {}, [Symbol.iterator]: () => [] }])).toBe(false)
})

it('isJSONObject', () => {
  expect(isJSONObject({})).toBe(true)
  expect(isJSONObject({ a: 1 })).toBe(true)
  expect(isJSONObject({ a: () => {}, [Symbol.iterator]: () => [] })).toBe(false)
})

import { describe, expect, it } from 'vitest'
import { isArray, isBlob, isBoolean, isDate, isDef, isEmptyObject, isFinite, isFunction, isInteger, isJSONArray, isJSONObject, isJSONValue, isKeyof, isNull, isNumber, isPlainObject, isPrimitive, isRegexp, isSafeInteger, isString, isSymbol, isTypedArray, isTypeof, isUndefined } from './is'

describe('common > getTypeName', () => {
  it('should return type name', () => {
    expect(isTypeof(undefined, 'undefined')).toBe(true)
    expect(isTypeof(null, 'null')).toBe(true)
    expect(isTypeof(1, 'number')).toBe(true)
    expect(isTypeof('1', 'string')).toBe(true)
    expect(isTypeof(true, 'boolean')).toBe(true)
    expect(isTypeof({}, 'object')).toBe(true)
    expect(isTypeof(() => {}, 'function')).toBe(true)
  })

  it('should return Constructor name', () => {
    expect(isTypeof(/\d/, 'regexp')).toBe(true)
    expect(isTypeof(new Error('message'), 'error')).toBe(true)
    expect(isTypeof(new Date(), 'date')).toBe(true)

    expect(isTypeof(new Map(), 'map')).toBe(true)
    expect(isTypeof(new Set(), 'set')).toBe(true)
    expect(isTypeof(new WeakMap(), 'weakmap')).toBe(true)
    expect(isTypeof(new WeakSet(), 'weakset')).toBe(true)

    expect(isTypeof(new URL('https://example.com'), 'url')).toBe(true)
    expect(isTypeof(new Blob(['a']), 'blob')).toBe(true)
    expect(isTypeof(new File(['a'], 'a'), 'file')).toBe(true)

    expect(isTypeof(new ArrayBuffer(1), 'arraybuffer')).toBe(true)
    expect(isTypeof(new SharedArrayBuffer(1), 'sharedarraybuffer')).toBe(true)
    expect(isTypeof(new DataView(new ArrayBuffer(1)), 'dataview')).toBe(true)

    expect(isTypeof(new Uint8Array([1]), 'uint8array')).toBe(true)
    expect(isTypeof(new Uint16Array([1]), 'uint16array')).toBe(true)
    expect(isTypeof(new Uint32Array([1]), 'uint32array')).toBe(true)
    expect(isTypeof(new Int8Array([1]), 'int8array')).toBe(true)
    expect(isTypeof(new Int16Array([1]), 'int16array')).toBe(true)
    expect(isTypeof(new Int32Array([1]), 'int32array')).toBe(true)
    expect(isTypeof(new Float32Array([1]), 'float32array')).toBe(true)
    expect(isTypeof(new Float64Array([1]), 'float64array')).toBe(true)
  })
})

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

describe('isKeyof', () => {
  it('should work', () => {
    expect(isKeyof({ a: 1 }, 'a')).toBe(true)
    expect(isKeyof({ a: 1 }, 'b')).toBe(false)
  })

  it('should work with symbol', () => {
    const symbol = Symbol('a')
    expect(isKeyof({ [symbol]: 1 }, symbol)).toBe(true)
  })

  it('should work width extends object', () => {
    const obj1 = { a: 1 }
    const obj2 = Object.create(obj1)
    obj2.b = 1

    expect(isKeyof(obj1, 'a')).toBe(true)
    expect(isKeyof(obj2, 'a')).toBe(true)
  })
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

it('isInteger', () => {
  expect(isInteger(1)).toBe(true)
  expect(isInteger(1.1)).toBe(false)
  expect(isInteger(Number.NaN)).toBe(false)
  expect(isInteger(Infinity)).toBe(false)
  expect(isInteger(-Infinity)).toBe(false)

  expect(isInteger(2 ** 53 - 1)).toBe(true)
  expect(isInteger(2 ** 53)).toBe(true)
  expect(isInteger(2 ** 53 + 1)).toBe(true)

  expect(isInteger('1')).toBe(false)
  expect(isInteger('')).toBe(false)
  expect(isInteger('a')).toBe(false)

  expect(isInteger({})).toBe(false)
  expect(isInteger([])).toBe(false)
  expect(isInteger(() => {})).toBe(false)
})

it('isSafeInteger', () => {
  expect(isSafeInteger(1)).toBe(true)
  expect(isSafeInteger(2 ** 53 - 1)).toBe(true)
  expect(isSafeInteger(2 ** 53)).toBe(false)
  expect(isSafeInteger(2 ** 53 + 1)).toBe(false)
  expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true)
  expect(isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false)
  expect(isSafeInteger(Number.MIN_SAFE_INTEGER)).toBe(true)
  expect(isSafeInteger(Number.MIN_SAFE_INTEGER - 1)).toBe(false)

  expect(isSafeInteger(1.1)).toBe(false)
  expect(isSafeInteger(Number.NaN)).toBe(false)
  expect(isSafeInteger(Infinity)).toBe(false)
  expect(isSafeInteger(-Infinity)).toBe(false)

  expect(isSafeInteger('1')).toBe(false)
  expect(isSafeInteger('')).toBe(false)
  expect(isSafeInteger('a')).toBe(false)

  expect(isSafeInteger({})).toBe(false)
  expect(isSafeInteger([])).toBe(false)
  expect(isSafeInteger(() => {})).toBe(false)
})

it('isFinite', () => {
  expect(isFinite(1)).toBe(true)
  expect(isFinite(2 ** 53 - 1)).toBe(true)
  expect(isFinite(2 ** 53)).toBe(true)
  expect(isFinite(2 ** 53 + 1)).toBe(true)
  expect(isFinite(Number.MAX_SAFE_INTEGER)).toBe(true)
  expect(isFinite(Number.MAX_SAFE_INTEGER + 1)).toBe(true)
  expect(isFinite(Number.MIN_SAFE_INTEGER)).toBe(true)
  expect(isFinite(Number.MIN_SAFE_INTEGER - 1)).toBe(true)

  expect(isFinite(1.1)).toBe(true)
  expect(isFinite(Number.NaN)).toBe(false)
  expect(isFinite(Infinity)).toBe(false)
  expect(isFinite(-Infinity)).toBe(false)
})

import { describe, expect, it } from 'vitest'
import { typeOf } from './type-of'

describe('predicate > typeOf', () => {
  it('should return type name', () => {
    expect(typeOf(undefined)).toBe('undefined')
    expect(typeOf(null)).toBe('null')
    expect(typeOf(1)).toBe('number')
    expect(typeOf('1')).toBe('string')
    expect(typeOf(true)).toBe('boolean')
    expect(typeOf({})).toBe('object')
    expect(typeOf(() => {})).toBe('function')
  })

  it('should return Constructor name', () => {
    expect(typeOf(/\d/)).toBe('regexp')
    expect(typeOf(new Error('message'))).toBe('error')
    expect(typeOf(new Date())).toBe('date')

    expect(typeOf(new Map())).toBe('map')
    expect(typeOf(new Set())).toBe('set')
    expect(typeOf(new WeakMap())).toBe('weakmap')
    expect(typeOf(new WeakSet())).toBe('weakset')

    expect(typeOf(new URL('https://example.com'))).toBe('url')
    expect(typeOf(new Blob(['a']))).toBe('blob')
    expect(typeOf(new File(['a'], 'a'))).toBe('file')

    expect(typeOf(new ArrayBuffer(1))).toBe('arraybuffer')
    expect(typeOf(new SharedArrayBuffer(1))).toBe('sharedarraybuffer')
    expect(typeOf(new DataView(new ArrayBuffer(1)))).toBe('dataview')

    expect(typeOf(new Uint8Array([1]))).toBe('uint8array')
    expect(typeOf(new Uint16Array([1]))).toBe('uint16array')
    expect(typeOf(new Uint32Array([1]))).toBe('uint32array')
    expect(typeOf(new Int8Array([1]))).toBe('int8array')
    expect(typeOf(new Int16Array([1]))).toBe('int16array')
    expect(typeOf(new Int32Array([1]))).toBe('int32array')
    expect(typeOf(new Float32Array([1]))).toBe('float32array')
    expect(typeOf(new Float64Array([1]))).toBe('float64array')
  })
})

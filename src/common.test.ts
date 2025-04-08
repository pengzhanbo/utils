import { describe, expect, it } from 'vitest'
import { assert, getTypeName } from './common'

describe('common > getTypeName', () => {
  it('should return type name', () => {
    expect(getTypeName(undefined)).toEqual('undefined')
    expect(getTypeName(null)).toEqual('null')
    expect(getTypeName(1)).toEqual('number')
    expect(getTypeName('1')).toEqual('string')
    expect(getTypeName(true)).toEqual('boolean')
    expect(getTypeName({})).toEqual('object')
    expect(getTypeName(() => {})).toEqual('function')
  })

  it('should return Constructor name', () => {
    expect(getTypeName(/\d/)).toEqual('regexp')
    expect(getTypeName(new Error('message'))).toEqual('error')
    expect(getTypeName(new Date())).toEqual('date')

    expect(getTypeName(new Map())).toEqual('map')
    expect(getTypeName(new Set())).toEqual('set')
    expect(getTypeName(new WeakMap())).toEqual('weakmap')
    expect(getTypeName(new WeakSet())).toEqual('weakset')

    expect(getTypeName(new URL('https://example.com'))).toEqual('url')
    expect(getTypeName(new Blob(['a']))).toEqual('blob')
    expect(getTypeName(new File(['a'], 'a'))).toEqual('file')

    expect(getTypeName(new ArrayBuffer(1))).toEqual('arraybuffer')
    expect(getTypeName(new SharedArrayBuffer(1))).toEqual('sharedarraybuffer')
    expect(getTypeName(new DataView(new ArrayBuffer(1)))).toEqual('dataview')

    expect(getTypeName(new Uint8Array([1]))).toEqual('uint8array')
    expect(getTypeName(new Uint16Array([1]))).toEqual('uint16array')
    expect(getTypeName(new Uint32Array([1]))).toEqual('uint32array')
    expect(getTypeName(new Int8Array([1]))).toEqual('int8array')
    expect(getTypeName(new Int16Array([1]))).toEqual('int16array')
    expect(getTypeName(new Int32Array([1]))).toEqual('int32array')
    expect(getTypeName(new Float32Array([1]))).toEqual('float32array')
    expect(getTypeName(new Float64Array([1]))).toEqual('float64array')
  })
})

describe('common > assert', () => {
  it('should throw error', () => {
    expect(() => assert(false)).toThrow()
  })

  it('should not throw error', () => {
    expect(() => assert(true)).not.toThrow()
  })
})

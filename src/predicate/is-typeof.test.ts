import { describe, expect, it } from 'vitest'
import { isTypeof } from './is-typeof'

describe('predicate > isTypeof', () => {
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

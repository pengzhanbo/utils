import { describe, expect, it } from 'vitest'
import { isTypedArray } from './is-typed-array'

describe('predicate > isTypedArray', () => {
  it('should work', () => {
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
})

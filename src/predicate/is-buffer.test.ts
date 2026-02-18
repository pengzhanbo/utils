import { describe, expect, it } from 'vitest'
import { isBuffer } from './is-buffer'

describe('predicate > isBuffer', () => {
  it('should return false in Node.js environment when Buffer is not available', () => {
    expect(isBuffer(Buffer)).toBe(false)
  })

  it('should return false for non-Buffer values', () => {
    expect(isBuffer('string')).toBe(false)
    expect(isBuffer(123)).toBe(false)
    expect(isBuffer({})).toBe(false)
    expect(isBuffer([])).toBe(false)
    expect(isBuffer(null)).toBe(false)
    expect(isBuffer(undefined)).toBe(false)
  })

  it('should return false for primitive values', () => {
    expect(isBuffer(true)).toBe(false)
    expect(isBuffer(Symbol('test'))).toBe(false)
    expect(isBuffer(0)).toBe(false)
    expect(isBuffer('')).toBe(false)
  })

  it('should return false for objects that look like buffer but are not', () => {
    expect(isBuffer({ type: 'Buffer', data: [] })).toBe(false)
    expect(isBuffer({ length: 10 })).toBe(false)
  })
})

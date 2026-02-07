import { describe, expect, it } from 'vitest'
import { clearUndefined } from './clear-undefined'

describe('clearUndefined', () => {
  it('should remove keys with undefined values', () => {
    const obj = { a: 1, b: undefined, c: 3 }
    clearUndefined(obj)
    expect(obj).toEqual({ a: 1, c: 3 })
    expect('b' in obj).toBe(false)
  })

  it('should not remove keys with null values', () => {
    const obj = { a: 1, b: null }
    clearUndefined(obj)
    expect(obj).toEqual({ a: 1, b: null })
  })

  it('should not remove keys with other falsy values', () => {
    const obj = { a: 0, b: false, c: '' }
    clearUndefined(obj)
    expect(obj).toEqual({ a: 0, b: false, c: '' })
  })

  it('should return the same object reference', () => {
    const obj = { a: 1, b: undefined }
    const result = clearUndefined(obj)
    expect(result).toBe(obj)
  })

  it('should handle empty object', () => {
    const obj = {}
    clearUndefined(obj)
    expect(obj).toEqual({})
  })

  it('should only remove shallow undefined values', () => {
    const obj = { a: 1, b: { c: undefined } }
    clearUndefined(obj)
    expect(obj).toEqual({ a: 1, b: { c: undefined } })
  })
})

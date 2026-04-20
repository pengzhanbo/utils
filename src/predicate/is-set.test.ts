import { describe, expect, it } from 'vitest'
import { isSet } from './is-set'

describe('predicate > isSet', () => {
  it('should return true for Set instances', () => {
    expect(isSet(new Set())).toBe(true)
    expect(isSet(new Set([1, 2, 3]))).toBe(true)
  })

  it('should return false for non-Set values', () => {
    expect(isSet({})).toBe(false)
    expect(isSet([])).toBe(false)
    expect(isSet(new Map())).toBe(false)
    expect(isSet(new WeakSet())).toBe(false)
    expect(isSet(null)).toBe(false)
    expect(isSet(undefined)).toBe(false)
    expect(isSet('set')).toBe(false)
    expect(isSet(123)).toBe(false)
  })
})

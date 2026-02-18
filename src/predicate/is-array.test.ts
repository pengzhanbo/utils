import { describe, expect, it } from 'vitest'
import { isArray } from './is-array'

describe('predicate > isArray', () => {
  it('should work', () => {
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
})

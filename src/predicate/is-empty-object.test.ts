import { describe, expect, it } from 'vitest'
import { isEmptyObject } from './is-empty-object'

describe('predicate > isEmptyObject', () => {
  it('should work', () => {
    expect(isEmptyObject(undefined)).toBe(false)
    expect(isEmptyObject(null)).toBe(false)
    expect(isEmptyObject(1)).toBe(false)
    expect(isEmptyObject('1')).toBe(false)
    expect(isEmptyObject(true)).toBe(false)
    expect(isEmptyObject(false)).toBe(false)
    expect(isEmptyObject({})).toBe(true)
    expect(isEmptyObject({ a: 1 })).toBe(false)
  })
})

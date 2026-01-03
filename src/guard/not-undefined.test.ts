import { describe, expect, it } from 'vitest'
import { notUndefined } from './not-undefined'

describe('guard > notUndefined', () => {
  it('should work', () => {
    expect(notUndefined(null)).toBe(true)
    expect(notUndefined('')).toBe(true)
    expect(notUndefined(1)).toBe(true)
    expect(notUndefined(true)).toBe(true)
    expect(notUndefined([])).toBe(true)
    expect(notUndefined({})).toBe(true)
    expect(notUndefined(undefined)).toBe(false)
  })

  it('should work with filter', () => {
    expect([1, 2, 3, '', false, undefined].filter(notUndefined)).toEqual([1, 2, 3, '', false])
  })
})

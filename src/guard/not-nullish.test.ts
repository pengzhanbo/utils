import { describe, expect, it } from 'vitest'
import { notNullish } from './not-nullish'

describe('guard > notNullish', () => {
  it('should work', () => {
    expect(notNullish(null)).toBe(false)
    expect(notNullish('')).toBe(true)
    expect(notNullish(1)).toBe(true)
    expect(notNullish(true)).toBe(true)
    expect(notNullish([])).toBe(true)
    expect(notNullish({})).toBe(true)
    expect(notNullish(undefined)).toBe(false)
  })

  it('should work with filter', () => {
    expect([1, 2, 3, '', false, undefined].filter(notNullish)).toEqual([1, 2, 3, '', false])
  })
})

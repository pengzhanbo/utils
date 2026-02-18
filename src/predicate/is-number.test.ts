import { describe, expect, it } from 'vitest'
import { isNumber } from './is-number'

describe('predicate > isNumber', () => {
  it('should work', () => {
    expect(isNumber(undefined)).toBe(false)
    expect(isNumber(null)).toBe(false)
    expect(isNumber(1)).toBe(true)
    expect(isNumber('1')).toBe(false)
    expect(isNumber(true)).toBe(false)
    expect(isNumber(false)).toBe(false)
    expect(isNumber({})).toBe(false)
    expect(isNumber(() => {})).toBe(false)
  })
})

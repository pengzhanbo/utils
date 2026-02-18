import { describe, expect, it } from 'vitest'
import { isSafeInteger } from './is-safe-integer'

describe('predicate > isSafeInteger', () => {
  it('should work', () => {
    expect(isSafeInteger(1)).toBe(true)
    expect(isSafeInteger(2 ** 53 - 1)).toBe(true)
    expect(isSafeInteger(2 ** 53)).toBe(false)
    expect(isSafeInteger(2 ** 53 + 1)).toBe(false)
    expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true)
    expect(isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false)
    expect(isSafeInteger(Number.MIN_SAFE_INTEGER)).toBe(true)
    expect(isSafeInteger(Number.MIN_SAFE_INTEGER - 1)).toBe(false)

    expect(isSafeInteger(1.1)).toBe(false)
    expect(isSafeInteger(Number.NaN)).toBe(false)
    expect(isSafeInteger(Infinity)).toBe(false)
    expect(isSafeInteger(-Infinity)).toBe(false)

    expect(isSafeInteger('1')).toBe(false)
    expect(isSafeInteger('')).toBe(false)
    expect(isSafeInteger('a')).toBe(false)

    expect(isSafeInteger({})).toBe(false)
    expect(isSafeInteger([])).toBe(false)
    expect(isSafeInteger(() => {})).toBe(false)
  })
})

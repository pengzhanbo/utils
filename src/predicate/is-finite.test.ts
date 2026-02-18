import { describe, expect, it } from 'vitest'
import { isFinite } from './is-finite'

describe('predicate > isFinite', () => {
  it('should work', () => {
    expect(isFinite(1)).toBe(true)
    expect(isFinite(2 ** 53 - 1)).toBe(true)
    expect(isFinite(2 ** 53)).toBe(true)
    expect(isFinite(2 ** 53 + 1)).toBe(true)
    expect(isFinite(Number.MAX_SAFE_INTEGER)).toBe(true)
    expect(isFinite(Number.MAX_SAFE_INTEGER + 1)).toBe(true)
    expect(isFinite(Number.MIN_SAFE_INTEGER)).toBe(true)
    expect(isFinite(Number.MIN_SAFE_INTEGER - 1)).toBe(true)

    expect(isFinite(1.1)).toBe(true)
    expect(isFinite(Number.NaN)).toBe(false)
    expect(isFinite(Infinity)).toBe(false)
    expect(isFinite(-Infinity)).toBe(false)
  })
})

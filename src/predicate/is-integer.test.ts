import { describe, expect, it } from 'vitest'
import { isInteger } from './is-integer'

describe('predicate > isInteger', () => {
  it('should work', () => {
    expect(isInteger(1)).toBe(true)
    expect(isInteger(1.1)).toBe(false)
    expect(isInteger(Number.NaN)).toBe(false)
    expect(isInteger(Infinity)).toBe(false)
    expect(isInteger(-Infinity)).toBe(false)

    expect(isInteger(2 ** 53 - 1)).toBe(true)
    expect(isInteger(2 ** 53)).toBe(true)
    expect(isInteger(2 ** 53 + 1)).toBe(true)

    expect(isInteger('1')).toBe(false)
    expect(isInteger('')).toBe(false)
    expect(isInteger('a')).toBe(false)

    expect(isInteger({})).toBe(false)
    expect(isInteger([])).toBe(false)
    expect(isInteger(() => {})).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { lcm } from './lcm'

describe('math > lcm', () => {
  it('should return the LCM of two positive numbers', () => {
    expect(lcm(12, 8)).toBe(24)
    expect(lcm(17, 13)).toBe(221)
    expect(lcm(100, 25)).toBe(100)
  })

  it('should return 0 when one number is 0', () => {
    expect(lcm(0, 5)).toBe(0)
    expect(lcm(5, 0)).toBe(0)
    expect(lcm(0, 0)).toBe(0)
  })

  it('should return the LCM of negative numbers', () => {
    expect(lcm(-12, 8)).toBe(24)
    expect(lcm(12, -8)).toBe(24)
    expect(lcm(-12, -8)).toBe(24)
  })

  it('should return the number when both numbers are the same', () => {
    expect(lcm(7, 7)).toBe(7)
    expect(lcm(100, 100)).toBe(100)
  })

  it('should return the product for coprime numbers', () => {
    expect(lcm(17, 13)).toBe(221)
    expect(lcm(23, 29)).toBe(667)
  })

  it('should handle floating-point numbers by truncating to integers', () => {
    expect(lcm(12.5, 8.5)).toBe(24)
    expect(lcm(12.9, 8.1)).toBe(24)
  })

  it('should handle NaN input', () => {
    expect(lcm(Number.NaN, 5)).toBeNaN()
    expect(lcm(5, Number.NaN)).toBeNaN()
  })

  it('should handle Infinity input', () => {
    expect(lcm(Number.POSITIVE_INFINITY, 5)).toBeNaN()
    expect(lcm(5, Number.POSITIVE_INFINITY)).toBeNaN()
  })
})

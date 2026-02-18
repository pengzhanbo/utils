import { describe, expect, it } from 'vitest'
import { gcd } from './gcd'

describe('math > gcd', () => {
  it('should return the GCD of two positive numbers', () => {
    expect(gcd(12, 8)).toBe(4)
    expect(gcd(17, 13)).toBe(1)
    expect(gcd(100, 25)).toBe(25)
  })

  it('should return the GCD when one number is 0', () => {
    expect(gcd(0, 5)).toBe(5)
    expect(gcd(5, 0)).toBe(5)
    expect(gcd(0, 0)).toBe(0)
  })

  it('should return the GCD of negative numbers', () => {
    expect(gcd(-12, 8)).toBe(4)
    expect(gcd(12, -8)).toBe(4)
    expect(gcd(-12, -8)).toBe(4)
  })

  it('should return the GCD when both numbers are the same', () => {
    expect(gcd(7, 7)).toBe(7)
    expect(gcd(100, 100)).toBe(100)
  })

  it('should return 1 for coprime numbers', () => {
    expect(gcd(17, 13)).toBe(1)
    expect(gcd(23, 29)).toBe(1)
  })

  it('should handle floating-point numbers by truncating to integers', () => {
    expect(gcd(12.5, 8.5)).toBe(4)
    expect(gcd(12.9, 8.1)).toBe(4)
  })

  it('should handle NaN input', () => {
    expect(gcd(Number.NaN, 5)).toBeNaN()
    expect(gcd(5, Number.NaN)).toBeNaN()
  })

  it('should handle Infinity input', () => {
    expect(gcd(Number.POSITIVE_INFINITY, 5)).toBeNaN()
    expect(gcd(5, Number.POSITIVE_INFINITY)).toBeNaN()
  })
})

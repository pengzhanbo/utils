import { describe, expect, it } from 'vitest'
import { isPrime } from './is-prime'

describe('math > isPrime', () => {
  it('should return true for prime numbers', () => {
    expect(isPrime(2)).toBe(true)
    expect(isPrime(3)).toBe(true)
    expect(isPrime(5)).toBe(true)
    expect(isPrime(7)).toBe(true)
    expect(isPrime(11)).toBe(true)
    expect(isPrime(13)).toBe(true)
    expect(isPrime(17)).toBe(true)
    expect(isPrime(19)).toBe(true)
    expect(isPrime(23)).toBe(true)
    expect(isPrime(97)).toBe(true)
  })

  it('should return false for non-prime numbers', () => {
    expect(isPrime(4)).toBe(false)
    expect(isPrime(6)).toBe(false)
    expect(isPrime(8)).toBe(false)
    expect(isPrime(9)).toBe(false)
    expect(isPrime(10)).toBe(false)
    expect(isPrime(100)).toBe(false)
  })

  it('should return false for numbers less than 2', () => {
    expect(isPrime(0)).toBe(false)
    expect(isPrime(1)).toBe(false)
    expect(isPrime(-1)).toBe(false)
    expect(isPrime(-5)).toBe(false)
  })

  it('should truncate floating-point numbers', () => {
    expect(isPrime(7.5)).toBe(true)
    expect(isPrime(7.9)).toBe(true)
    expect(isPrime(4.5)).toBe(false)
  })

  it('should handle NaN input', () => {
    expect(isPrime(Number.NaN)).toBe(false)
  })

  it('should handle Infinity input', () => {
    expect(isPrime(Number.POSITIVE_INFINITY)).toBe(false)
    expect(isPrime(Number.NEGATIVE_INFINITY)).toBe(false)
  })

  it('should handle large prime numbers', () => {
    expect(isPrime(7919)).toBe(true)
    expect(isPrime(104729)).toBe(true)
  })
})

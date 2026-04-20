import { describe, expect, it } from 'vitest'
import { toFinite } from './to-finite'

describe('guard > toFinite', () => {
  it('should convert string to finite number', () => {
    expect(toFinite('42')).toBe(42)
    expect(toFinite('3.14')).toBe(3.14)
    expect(toFinite('-10')).toBe(-10)
  })

  it('should return NaN for Infinity', () => {
    expect(toFinite(Infinity)).toBeNaN()
    expect(toFinite(-Infinity)).toBeNaN()
  })

  it('should return NaN for non-numeric string', () => {
    expect(toFinite('hello')).toBeNaN()
  })

  it('should return number as-is if finite', () => {
    expect(toFinite(42)).toBe(42)
    expect(toFinite(3.14)).toBe(3.14)
    expect(toFinite(-10)).toBe(-10)
    expect(toFinite(0)).toBe(0)
  })

  it('should convert null to 0', () => {
    expect(toFinite(null)).toBe(0)
  })

  it('should return NaN for undefined', () => {
    expect(toFinite(undefined)).toBeNaN()
  })

  it('should convert boolean to number', () => {
    expect(toFinite(true)).toBe(1)
    expect(toFinite(false)).toBe(0)
  })

  it('should handle bigint within safe range', () => {
    expect(toFinite(BigInt(Number.MAX_SAFE_INTEGER))).toBe(Number.MAX_SAFE_INTEGER)
  })

  it('should return NaN for NaN input', () => {
    expect(toFinite(Number.NaN)).toBeNaN()
  })

  it('should return NaN for Symbol', () => {
    expect(toFinite(Symbol('id'))).toBeNaN()
  })
})

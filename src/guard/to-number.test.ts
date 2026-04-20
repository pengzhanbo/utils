import { describe, expect, it } from 'vitest'
import { toNumber } from './to-number'

describe('guard > toNumber', () => {
  it('should convert string to number', () => {
    expect(toNumber('42')).toBe(42)
    expect(toNumber('3.14')).toBe(3.14)
    expect(toNumber('-10')).toBe(-10)
  })

  it('should convert numeric string with whitespace', () => {
    expect(toNumber('  42  ')).toBe(42)
  })

  it('should return NaN for non-numeric string', () => {
    expect(toNumber('hello')).toBeNaN()
    expect(toNumber('')).toBe(0)
  })

  it('should return number as-is', () => {
    expect(toNumber(42)).toBe(42)
    expect(toNumber(3.14)).toBe(3.14)
    expect(toNumber(-10)).toBe(-10)
  })

  it('should convert null to 0', () => {
    expect(toNumber(null)).toBe(0)
  })

  it('should convert undefined to NaN', () => {
    expect(toNumber(undefined)).toBeNaN()
  })

  it('should convert boolean to number', () => {
    expect(toNumber(true)).toBe(1)
    expect(toNumber(false)).toBe(0)
  })

  it('should convert bigint to number', () => {
    expect(toNumber(BigInt(42))).toBe(42)
  })

  it('should return NaN for NaN input', () => {
    expect(toNumber(Number.NaN)).toBeNaN()
  })

  it('should return NaN for objects', () => {
    expect(toNumber({})).toBeNaN()
    expect(toNumber([])).toBe(0)
  })

  it('should return NaN for Symbol', () => {
    expect(toNumber(Symbol('id'))).toBeNaN()
  })
})

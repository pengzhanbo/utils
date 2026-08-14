import { describe, expect, it } from 'vitest'
import { toNumber, tryToNumber } from './to-number.js'

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

  it('should convert Date to timestamp', () => {
    const date = new Date('2024-01-01T00:00:00.000Z')
    expect(toNumber(date)).toBe(date.getTime())
  })

  it('should return NaN for Function', () => {
    expect(toNumber(() => {})).toBeNaN()
    // oxlint-disable-next-line prefer-arrow-callback
    expect(toNumber(function foo() {})).toBeNaN()
  })

  it('should handle special number strings', () => {
    expect(toNumber('Infinity')).toBe(Number.POSITIVE_INFINITY)
    expect(toNumber('-Infinity')).toBe(Number.NEGATIVE_INFINITY)
    expect(toNumber('0x1F')).toBe(31)
  })

  it('should handle single-element arrays', () => {
    expect(toNumber([5])).toBe(5)
    expect(toNumber([1, 2])).toBeNaN()
  })
})

describe('guard > tryToNumber', () => {
  it('should convert numeric string to number', () => {
    expect(tryToNumber('42')).toBe(42)
    expect(tryToNumber('42.0')).toBe(42)
    expect(tryToNumber('3.14')).toBe(3.14)
    expect(tryToNumber('-10')).toBe(-10)
    expect(tryToNumber('+42')).toBe(42)
    expect(tryToNumber('.5')).toBe(0.5)
    expect(tryToNumber('1e3')).toBe(1000)
  })

  it('should convert numeric string with whitespace', () => {
    expect(tryToNumber('  42  ')).toBe(42)
    expect(tryToNumber('\t42\n')).toBe(42)
  })

  it('should convert special base number literals via Number', () => {
    expect(tryToNumber('0x2A')).toBe(42)
    expect(tryToNumber('0b101')).toBe(5)
    expect(tryToNumber('0o17')).toBe(15)
  })

  it('should fall back to parseFloat for partially numeric strings', () => {
    expect(tryToNumber('42abc')).toBe(42)
    expect(tryToNumber('42.5abc')).toBe(42.5)
    expect(tryToNumber(' 42abc')).toBe(42)
    expect(tryToNumber('42 43')).toBe(42)
    expect(tryToNumber('1,000')).toBe(1)
    expect(tryToNumber('1e')).toBe(1)
    expect(tryToNumber('Infinityabc')).toBe(Number.POSITIVE_INFINITY)
  })

  it('should return NaN for non-numeric strings', () => {
    expect(tryToNumber('hello')).toBeNaN()
    expect(tryToNumber('abc123')).toBeNaN()
  })

  it('should return 0 for empty or whitespace-only strings', () => {
    expect(tryToNumber('')).toBe(0)
    expect(tryToNumber(' ')).toBe(0)
  })

  it('should return number as-is', () => {
    expect(tryToNumber(42)).toBe(42)
    expect(tryToNumber(3.14)).toBe(3.14)
    expect(tryToNumber(-10)).toBe(-10)
  })

  it('should convert null to 0', () => {
    expect(tryToNumber(null)).toBe(0)
  })

  it('should convert undefined to NaN', () => {
    expect(tryToNumber(undefined)).toBeNaN()
  })

  it('should convert boolean to number', () => {
    expect(tryToNumber(true)).toBe(1)
    expect(tryToNumber(false)).toBe(0)
  })

  it('should convert bigint to number', () => {
    expect(tryToNumber(BigInt(42))).toBe(42)
  })

  it('should return NaN for NaN input', () => {
    expect(tryToNumber(Number.NaN)).toBeNaN()
  })

  it('should handle Infinity', () => {
    expect(tryToNumber(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY)
    expect(tryToNumber(Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY)
    expect(tryToNumber('Infinity')).toBe(Number.POSITIVE_INFINITY)
    expect(tryToNumber('-Infinity')).toBe(Number.NEGATIVE_INFINITY)
  })

  it('should return NaN for objects and functions', () => {
    expect(tryToNumber({})).toBeNaN()
    expect(tryToNumber(() => {})).toBeNaN()
    // oxlint-disable-next-line prefer-arrow-callback
    expect(tryToNumber(function foo() {})).toBeNaN()
  })

  it('should handle arrays', () => {
    expect(tryToNumber([])).toBe(0)
    expect(tryToNumber([5])).toBe(5)
    expect(tryToNumber([1, 2])).toBe(1)
  })

  it('should convert Date to timestamp', () => {
    const date = new Date('2024-01-01T00:00:00.000Z')
    expect(tryToNumber(date)).toBe(date.getTime())
  })

  it('should return NaN for Symbol', () => {
    expect(tryToNumber(Symbol('id'))).toBeNaN()
  })

  it('should preserve negative zero', () => {
    expect(Object.is(tryToNumber(-0), -0)).toBe(true)
    expect(Object.is(tryToNumber('-0'), -0)).toBe(true)
  })
})

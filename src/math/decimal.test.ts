import { describe, it, expect } from 'vitest'
import { decimalAdd, decimalSubtract, decimalMultiply, decimalDivide } from './decimal'

describe('decimalAdd', () => {
  it('should add two floats precisely', () => {
    expect(decimalAdd(0.1, 0.2)).toBe(0.3)
    expect(decimalAdd(1.5, 2.3)).toBe(3.8)
    expect(decimalAdd(10.001, 20.002)).toBe(30.003)
  })

  it('should handle integers', () => {
    expect(decimalAdd(1, 2)).toBe(3)
    expect(decimalAdd(100, 200)).toBe(300)
  })

  it('should handle mixed integers and floats', () => {
    expect(decimalAdd(1, 0.5)).toBe(1.5)
    expect(decimalAdd(0.5, 1)).toBe(1.5)
  })

  it('should handle negative numbers', () => {
    expect(decimalAdd(-0.1, -0.2)).toBe(-0.3)
    expect(decimalAdd(0.1, -0.2)).toBe(-0.1)
  })

  it('should handle large numbers', () => {
    expect(decimalAdd(1000000.1, 2000000.2)).toBe(3000000.3)
  })

  it('should handle zero', () => {
    expect(decimalAdd(0, 0)).toBe(0)
    expect(decimalAdd(0, 0.1)).toBe(0.1)
    expect(decimalAdd(0.1, 0)).toBe(0.1)
  })

  it('should handle large numbers that exceed MAX_SAFE_INTEGER', () => {
    const result = decimalAdd(900719925474099.1, 0.1)
    // oxlint-disable-next-line no-loss-of-precision
    expect(result).toBe(900719925474099.2)
  })

  it('should return NaN when integer overflow occurs', () => {
    expect(decimalAdd(1e15, 0.123456789)).toBeNaN()
  })

  it('should handle scientific notation with negative exponent', () => {
    expect(decimalAdd(1e-7, 2e-7)).toBeCloseTo(3e-7, 10)
    expect(decimalAdd(1.5e-3, 2.5e-3)).toBeCloseTo(0.004, 10)
  })

  it('should handle scientific notation with positive exponent', () => {
    expect(decimalAdd(1e7, 2e7)).toBe(3e7)
  })

  it('should return NaN when adding with NaN', () => {
    expect(decimalAdd(Number.NaN, 1)).toBeNaN()
    expect(decimalAdd(1, Number.NaN)).toBeNaN()
  })

  it('should return NaN when adding with Infinity', () => {
    expect(decimalAdd(Number.POSITIVE_INFINITY, 1)).toBeNaN()
    expect(decimalAdd(1, Number.POSITIVE_INFINITY)).toBeNaN()
    expect(decimalAdd(Number.NEGATIVE_INFINITY, 1)).toBeNaN()
    expect(decimalAdd(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)).toBeNaN()
  })

  it('should return NaN when integer overflow to Infinity occurs', () => {
    expect(decimalAdd(1e200, 1e200)).toBeNaN()
  })
})

describe('decimalSubtract', () => {
  it('should subtract two floats precisely', () => {
    expect(decimalSubtract(0.1, 0.2)).toBe(-0.1)
    expect(decimalSubtract(1.5, 2.3)).toBe(-0.8)
    expect(decimalSubtract(10.001, 20.002)).toBe(-10.001)
  })

  it('should handle integers', () => {
    expect(decimalSubtract(5, 3)).toBe(2)
    expect(decimalSubtract(100, 200)).toBe(-100)
  })

  it('should handle negative numbers', () => {
    expect(decimalSubtract(-0.1, -0.2)).toBe(0.1)
    expect(decimalSubtract(0.1, -0.2)).toBe(0.3)
    expect(decimalSubtract(-0.1, 0.2)).toBe(-0.3)
  })

  it('should handle zero', () => {
    expect(decimalSubtract(0, 0)).toBe(0)
    expect(decimalSubtract(0, 0.1)).toBe(-0.1)
    expect(decimalSubtract(0.1, 0)).toBe(0.1)
  })

  it('should handle same decimal places', () => {
    expect(decimalSubtract(1.5, 0.5)).toBe(1)
    expect(decimalSubtract(10.25, 5.75)).toBe(4.5)
  })

  it('should handle different decimal places', () => {
    expect(decimalSubtract(1.5, 0.25)).toBe(1.25)
    expect(decimalSubtract(10.001, 5.1)).toBe(4.901)
  })

  it('should handle scientific notation with negative exponent', () => {
    expect(decimalSubtract(3e-7, 1e-7)).toBeCloseTo(2e-7, 10)
  })

  it('should return NaN when subtracting with NaN', () => {
    expect(decimalSubtract(Number.NaN, 1)).toBeNaN()
    expect(decimalSubtract(1, Number.NaN)).toBeNaN()
  })

  it('should return NaN when subtracting with Infinity', () => {
    expect(decimalSubtract(Number.POSITIVE_INFINITY, 1)).toBeNaN()
    expect(decimalSubtract(1, Number.POSITIVE_INFINITY)).toBeNaN()
    expect(decimalSubtract(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).toBeNaN()
  })
})

describe('decimalMultiply', () => {
  it('should multiply two floats precisely', () => {
    expect(decimalMultiply(0.1, 0.2)).toBe(0.02)
    expect(decimalMultiply(1.5, 2.3)).toBe(3.45)
    expect(decimalMultiply(10.001, 20)).toBe(200.02)
  })

  it('should handle integers', () => {
    expect(decimalMultiply(5, 3)).toBe(15)
    expect(decimalMultiply(100, 200)).toBe(20000)
  })

  it('should handle negative numbers', () => {
    expect(decimalMultiply(-0.1, 0.2)).toBe(-0.02)
    expect(decimalMultiply(0.1, -0.2)).toBe(-0.02)
    expect(decimalMultiply(-0.1, -0.2)).toBe(0.02)
  })

  it('should handle zero', () => {
    expect(decimalMultiply(0, 0)).toBe(0)
    expect(decimalMultiply(0, 0.1)).toBe(0)
    expect(decimalMultiply(0.1, 0)).toBe(0)
  })

  it('should handle decimal times integer', () => {
    expect(decimalMultiply(0.1, 10)).toBe(1)
    expect(decimalMultiply(10, 0.1)).toBe(1)
  })

  it('should handle same decimal places', () => {
    expect(decimalMultiply(0.5, 0.5)).toBe(0.25)
    expect(decimalMultiply(1.25, 2.5)).toBe(3.125)
  })

  it('should handle different decimal places', () => {
    expect(decimalMultiply(0.1, 0.25)).toBe(0.025)
    expect(decimalMultiply(0.01, 0.001)).toBe(0.00001)
  })

  it('should handle scientific notation with negative exponent', () => {
    expect(decimalMultiply(1e-7, 2)).toBeCloseTo(2e-7, 10)
  })

  it('should return NaN when multiplying with NaN', () => {
    expect(decimalMultiply(Number.NaN, 1)).toBeNaN()
    expect(decimalMultiply(1, Number.NaN)).toBeNaN()
  })

  it('should return NaN when multiplying with Infinity', () => {
    expect(decimalMultiply(Number.POSITIVE_INFINITY, 2)).toBeNaN()
    expect(decimalMultiply(2, Number.POSITIVE_INFINITY)).toBeNaN()
    expect(decimalMultiply(Number.POSITIVE_INFINITY, 0)).toBeNaN()
  })

  it('should return NaN when integer overflow occurs', () => {
    expect(decimalMultiply(1e16, 0.1)).toBeNaN()
  })
})

describe('decimalDivide', () => {
  it('should divide two floats precisely', () => {
    expect(decimalDivide(0.3, 0.1)).toBe(3)
    expect(decimalDivide(0.6, 0.2)).toBe(3)
    expect(decimalDivide(0.1, 0.2, 10)).toBe(0.5)
    expect(decimalDivide(1.5, 2.3, 16)).toBeCloseTo(0.6521739130434783, 15)
    expect(decimalDivide(8.1, 0.9)).toBe(9)
    expect(decimalDivide(10.001, 20, 5)).toBe(0.50005)
  })

  it('should handle integers', () => {
    expect(decimalDivide(6, 3, 0)).toBe(2)
    expect(decimalDivide(100, 4, 0)).toBe(25)
    expect(decimalDivide(1, 3)).toBe(0.3333333333333333)
  })

  it('should handle negative numbers', () => {
    expect(decimalDivide(-0.1, 0.2, 10)).toBe(-0.5)
    expect(decimalDivide(0.1, -0.2, 10)).toBe(-0.5)
    expect(decimalDivide(-0.1, -0.2, 10)).toBe(0.5)
  })

  it('should handle zero dividend', () => {
    expect(decimalDivide(0, 5, 0)).toBe(0)
    expect(decimalDivide(0, 0.1, 10)).toBe(0)
  })

  it('should throw error when dividing by zero', () => {
    expect(() => decimalDivide(1, 0, 0)).toThrow('Division by zero is not allowed')
    expect(() => decimalDivide(0.1, 0, 10)).toThrow('Division by zero is not allowed')
  })

  it('should handle precision parameter', () => {
    expect(decimalDivide(1, 3, 2)).toBe(0.33)
    expect(decimalDivide(1, 3, 4)).toBe(0.3333)
    expect(decimalDivide(10, 3, 0)).toBe(3)
  })

  it('should throw TypeError when precision is not an integer', () => {
    expect(() => decimalDivide(1, 3, 1.5)).toThrow(TypeError)
    expect(() => decimalDivide(1, 3, 1.5)).toThrow('precision must be a non-negative integer')
    expect(() => decimalDivide(1, 3, Number.NaN)).toThrow(TypeError)
  })

  it('should throw TypeError when precision is negative', () => {
    expect(() => decimalDivide(100, 3, -1)).toThrow(TypeError)
    expect(() => decimalDivide(100, 3, -1)).toThrow('precision must be a non-negative integer')
  })

  it('should handle same decimal places', () => {
    expect(decimalDivide(0.5, 0.5, 10)).toBe(1)
    expect(decimalDivide(1.25, 0.25, 10)).toBe(5)
  })

  it('should handle different decimal places', () => {
    expect(decimalDivide(0.1, 0.25, 10)).toBe(0.4)
    expect(decimalDivide(0.01, 0.001, 10)).toBe(10)
  })

  it('should handle scientific notation with negative exponent', () => {
    expect(decimalDivide(2e-7, 2, 10)).toBeCloseTo(1e-7, 10)
  })

  it('should return NaN when dividing with NaN', () => {
    expect(decimalDivide(Number.NaN, 1, 10)).toBeNaN()
    expect(decimalDivide(1, Number.NaN, 10)).toBeNaN()
  })

  it('should return NaN when dividing by Infinity', () => {
    expect(decimalDivide(1, Number.POSITIVE_INFINITY, 10)).toBeNaN()
    expect(decimalDivide(Number.POSITIVE_INFINITY, 1, 10)).toBeNaN()
    expect(decimalDivide(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, 10)).toBeNaN()
  })
})

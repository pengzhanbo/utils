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
    expect(decimalDivide(10, 3, -1)).toBeCloseTo(3.3333333333333335, 15)
  })

  it('should handle negative precision', () => {
    const result = decimalDivide(100, 3, -1)
    expect(result).toBeCloseTo(33.333333333333336, 15)
  })

  it('should handle same decimal places', () => {
    expect(decimalDivide(0.5, 0.5, 10)).toBe(1)
    expect(decimalDivide(1.25, 0.25, 10)).toBe(5)
  })

  it('should handle different decimal places', () => {
    expect(decimalDivide(0.1, 0.25, 10)).toBe(0.4)
    expect(decimalDivide(0.01, 0.001, 10)).toBe(10)
  })
})

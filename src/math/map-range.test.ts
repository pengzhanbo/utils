import { describe, expect, it } from 'vitest'
import { mapRange } from './map-range'

describe('math > mapRange', () => {
  it('should map value correctly', () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50)
    expect(mapRange(0, 0, 10, 0, 100)).toBe(0)
    expect(mapRange(10, 0, 10, 0, 100)).toBe(100)
  })

  it('should map value with negative ranges', () => {
    expect(mapRange(0, -10, 10, 0, 100)).toBe(50)
    expect(mapRange(-10, -10, 10, 0, 100)).toBe(0)
    expect(mapRange(10, -10, 10, 0, 100)).toBe(100)
  })

  it('should map value with reversed output range', () => {
    expect(mapRange(0, 0, 10, 100, 0)).toBe(100)
    expect(mapRange(10, 0, 10, 100, 0)).toBe(0)
    expect(mapRange(5, 0, 10, 100, 0)).toBe(50)
  })

  it('should extrapolate beyond input range', () => {
    expect(mapRange(20, 0, 10, 0, 100)).toBe(200)
    expect(mapRange(-5, 0, 10, 0, 100)).toBe(-50)
  })

  it('should handle floating-point values', () => {
    expect(mapRange(2.5, 0, 10, 0, 100)).toBe(25)
    expect(mapRange(5, 0, 10, 0, 1)).toBe(0.5)
  })

  it('should handle same input min and max', () => {
    expect(mapRange(5, 0, 0, 0, 100)).toBe(Number.POSITIVE_INFINITY)
  })

  it('should handle NaN input', () => {
    expect(mapRange(Number.NaN, 0, 10, 0, 100)).toBeNaN()
    expect(mapRange(5, Number.NaN, 10, 0, 100)).toBeNaN()
    expect(mapRange(5, 0, Number.NaN, 0, 100)).toBeNaN()
    expect(mapRange(5, 0, 10, Number.NaN, 100)).toBeNaN()
    expect(mapRange(5, 0, 10, 0, Number.NaN)).toBeNaN()
  })

  it('should handle Infinity input', () => {
    expect(mapRange(Number.POSITIVE_INFINITY, 0, 10, 0, 100)).toBe(Number.POSITIVE_INFINITY)
    expect(mapRange(5, 0, 10, 0, Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY)
  })
})

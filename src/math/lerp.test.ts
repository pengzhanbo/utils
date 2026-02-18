import { describe, expect, it } from 'vitest'
import { lerp } from './lerp'

describe('math > lerp', () => {
  it('should return start when t is 0', () => {
    expect(lerp(0, 100, 0)).toBe(0)
    expect(lerp(50, 100, 0)).toBe(50)
  })

  it('should return end when t is 1', () => {
    expect(lerp(0, 100, 1)).toBe(100)
    expect(lerp(50, 100, 1)).toBe(100)
  })

  it('should return the middle value when t is 0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50)
    expect(lerp(0, 10, 0.5)).toBe(5)
  })

  it('should handle negative values', () => {
    expect(lerp(-100, 100, 0.5)).toBe(0)
    expect(lerp(-50, -10, 0.5)).toBe(-30)
  })

  it('should extrapolate beyond 0-1 range', () => {
    expect(lerp(0, 100, 2)).toBe(200)
    expect(lerp(0, 100, -1)).toBe(-100)
  })

  it('should handle floating-point values', () => {
    expect(lerp(0, 1, 0.1)).toBeCloseTo(0.1)
    expect(lerp(0, 1, 0.25)).toBe(0.25)
  })

  it('should handle NaN input', () => {
    expect(lerp(Number.NaN, 100, 0.5)).toBeNaN()
    expect(lerp(0, Number.NaN, 0.5)).toBeNaN()
    expect(lerp(0, 100, Number.NaN)).toBeNaN()
  })

  it('should handle Infinity input', () => {
    expect(lerp(0, Number.POSITIVE_INFINITY, 0.5)).toBe(Number.POSITIVE_INFINITY)
    expect(lerp(Number.NEGATIVE_INFINITY, 0, 0.5)).toBeNaN()
  })
})

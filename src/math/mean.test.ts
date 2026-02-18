import { describe, expect, it } from 'vitest'
import { mean } from './mean'

describe('math > mean', () => {
  it('should return the mean of positive numbers', () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3)
  })

  it('should return the mean of negative numbers', () => {
    expect(mean([-1, -2, -3])).toBe(-2)
  })

  it('should return the mean of mixed positive and negative numbers', () => {
    expect(mean([1, -2, 3, -4, 5])).toBe(0.6)
  })

  it('should return the mean of floating-point numbers', () => {
    expect(mean([1.5, 2.5, 3])).toBeCloseTo(2.333333)
  })

  it('should return NaN for an empty array', () => {
    expect(mean([])).toBeNaN()
  })

  it('should return the value for a single-element array', () => {
    expect(mean([42])).toBe(42)
  })

  it('should handle zero values', () => {
    expect(mean([0, 0, 0])).toBe(0)
  })

  it('should handle NaN in the array', () => {
    expect(mean([1, Number.NaN, 3])).toBeNaN()
  })

  it('should handle Infinity in the array', () => {
    expect(mean([1, Number.POSITIVE_INFINITY, 3])).toBe(Number.POSITIVE_INFINITY)
    expect(mean([1, Number.NEGATIVE_INFINITY, 3])).toBe(Number.NEGATIVE_INFINITY)
  })
})

import { describe, expect, it } from 'vitest'
import { sum } from './sum'

describe('math > sum', () => {
  it('should return the sum of positive numbers', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15)
  })

  it('should return the sum of negative numbers', () => {
    expect(sum([-1, -2, -3])).toBe(-6)
  })

  it('should return the sum of mixed positive and negative numbers', () => {
    expect(sum([1, -2, 3, -4, 5])).toBe(3)
  })

  it('should return the sum of floating-point numbers', () => {
    expect(sum([1.5, 2.5, 3])).toBe(7)
  })

  it('should return 0 for an empty array', () => {
    expect(sum([])).toBe(0)
  })

  it('should return the value for a single-element array', () => {
    expect(sum([42])).toBe(42)
  })

  it('should handle zero values', () => {
    expect(sum([0, 0, 0])).toBe(0)
  })

  it('should handle NaN in the array', () => {
    expect(sum([1, Number.NaN, 3])).toBeNaN()
  })

  it('should handle Infinity in the array', () => {
    expect(sum([1, Infinity, 3])).toBe(Infinity)
    expect(sum([1, -Infinity, 3])).toBe(-Infinity)
  })
})

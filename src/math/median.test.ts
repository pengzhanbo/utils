import { describe, expect, it } from 'vitest'
import { median } from './median'

describe('math > median', () => {
  it('should return the median of odd-length array', () => {
    expect(median([1, 2, 3, 4, 5])).toBe(3)
  })

  it('should return the median of even-length array', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5)
  })

  it('should return the median of unsorted array', () => {
    expect(median([5, 1, 3, 2, 4])).toBe(3)
  })

  it('should return the median of negative numbers', () => {
    expect(median([-3, -2, -1])).toBe(-2)
  })

  it('should return the median of mixed positive and negative numbers', () => {
    expect(median([-2, -1, 1, 2])).toBe(0)
  })

  it('should return the median of floating-point numbers', () => {
    expect(median([1.5, 2.5, 3.5])).toBe(2.5)
  })

  it('should return NaN for an empty array', () => {
    expect(median([])).toBeNaN()
  })

  it('should return the value for a single-element array', () => {
    expect(median([42])).toBe(42)
  })

  it('should handle zero values', () => {
    expect(median([0, 0, 0])).toBe(0)
  })

  it('should handle NaN in the array', () => {
    expect(median([1, Number.NaN, 3])).toBeNaN()
  })

  it('should handle Infinity in the array', () => {
    expect(median([1, Number.POSITIVE_INFINITY, 3])).toBe(3)
    expect(median([Number.NEGATIVE_INFINITY, 0, Number.POSITIVE_INFINITY])).toBe(0)
  })

  it('should not modify the original array', () => {
    const arr = [3, 1, 2]
    median(arr)
    expect(arr).toEqual([3, 1, 2])
  })
})

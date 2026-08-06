import { describe, expect, it } from 'vitest'
import { takeRight } from './take-right.js'

describe('array > take-right', () => {
  it('should take the last n elements', () => {
    expect(takeRight([1, 2, 3], 2)).toEqual([2, 3])
  })

  it('should default to taking the last element', () => {
    expect(takeRight([1, 2, 3])).toEqual([3])
  })

  it('should return an empty array when n is 0', () => {
    expect(takeRight([1, 2, 3], 0)).toEqual([])
  })

  it('should return an empty array when n is negative', () => {
    expect(takeRight([1, 2, 3], -2)).toEqual([])
  })

  it('should return the whole array when n exceeds the length', () => {
    expect(takeRight([1, 2, 3], 5)).toEqual([1, 2, 3])
  })

  it('should return an empty array when n is Number.NaN', () => {
    expect(takeRight([1, 2, 3], Number.NaN)).toEqual([])
  })

  it('should return an empty array when n is Infinity', () => {
    expect(takeRight([1, 2, 3], Infinity)).toEqual([])
  })

  it('should truncate a non-integer n', () => {
    expect(takeRight([1, 2, 3, 4], 2.9)).toEqual([3, 4])
    expect(takeRight([1, 2, 3, 4], -1.5)).toEqual([])
  })

  it('should return an empty array for empty input', () => {
    expect(takeRight([], 2)).toEqual([])
  })

  it('should preserve object references', () => {
    const obj = { c: 3 }
    const result = takeRight([{ a: 1 }, obj], 1)
    expect(result).toEqual([obj])
    expect(result[0]).toBe(obj)
  })

  it('should not mutate the input array', () => {
    const input = [1, 2, 3]
    takeRight(input, 2)
    expect(input).toEqual([1, 2, 3])
  })

  it('should return a new array', () => {
    const input = [1, 2, 3]
    expect(takeRight(input, 3)).not.toBe(input)
  })
})

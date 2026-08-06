import { describe, expect, it } from 'vitest'
import { take } from './take.js'

describe('array > take', () => {
  it('should take the first n elements', () => {
    expect(take([1, 2, 3, 4], 2)).toEqual([1, 2])
  })

  it('should default to taking 1 element', () => {
    expect(take([1, 2, 3])).toEqual([1])
  })

  it('should return an empty array when n is 0', () => {
    expect(take([1, 2, 3], 0)).toEqual([])
  })

  it('should return an empty array when n is negative', () => {
    expect(take([1, 2, 3], -2)).toEqual([])
  })

  it('should return the whole array when n exceeds the length', () => {
    expect(take([1, 2, 3], 5)).toEqual([1, 2, 3])
  })

  it('should return an empty array when n is Number.NaN', () => {
    expect(take([1, 2, 3], Number.NaN)).toEqual([])
  })

  it('should return an empty array when n is Infinity', () => {
    expect(take([1, 2, 3], Infinity)).toEqual([])
  })

  it('should truncate a non-integer n', () => {
    expect(take([1, 2, 3, 4], 2.9)).toEqual([1, 2])
    expect(take([1, 2, 3, 4], -1.5)).toEqual([])
  })

  it('should return an empty array for empty input', () => {
    expect(take([], 2)).toEqual([])
  })

  it('should preserve object references', () => {
    const obj = { a: 1 }
    const result = take([obj, { b: 2 }], 1)
    expect(result).toEqual([obj])
    expect(result[0]).toBe(obj)
  })

  it('should not mutate the input array', () => {
    const input = [1, 2, 3, 4]
    take(input, 2)
    expect(input).toEqual([1, 2, 3, 4])
  })

  it('should return a new array', () => {
    const input = [1, 2, 3]
    expect(take(input, 3)).not.toBe(input)
  })
})

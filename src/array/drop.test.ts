import { describe, expect, it } from 'vitest'
import { drop } from './drop'

describe('array > drop', () => {
  it('should drop the first n elements', () => {
    expect(drop([1, 2, 3, 4], 2)).toEqual([3, 4])
  })

  it('should default to dropping 1 element', () => {
    expect(drop([1, 2, 3])).toEqual([2, 3])
  })

  it('should return the whole array when n is 0', () => {
    expect(drop([1, 2, 3], 0)).toEqual([1, 2, 3])
  })

  it('should return the whole array when n is negative', () => {
    expect(drop([1, 2, 3], -2)).toEqual([1, 2, 3])
  })

  it('should return an empty array when n exceeds the length', () => {
    expect(drop([1, 2, 3], 5)).toEqual([])
  })

  it('should return the whole array when n is Number.NaN', () => {
    expect(drop([1, 2, 3], Number.NaN)).toEqual([1, 2, 3])
  })

  it('should return the whole array when n is Infinity', () => {
    expect(drop([1, 2, 3], Infinity)).toEqual([1, 2, 3])
  })

  it('should truncate a non-integer n', () => {
    expect(drop([1, 2, 3, 4], 2.9)).toEqual([3, 4])
    expect(drop([1, 2, 3, 4], -1.5)).toEqual([1, 2, 3, 4])
  })

  it('should return an empty array for empty input', () => {
    expect(drop([], 2)).toEqual([])
  })

  it('should preserve object references', () => {
    const obj = { a: 1 }
    const result = drop([obj, { b: 2 }], 1)
    expect(result).toEqual([{ b: 2 }])
    expect(result).not.toContain(obj)
  })

  it('should not mutate the input array', () => {
    const input = [1, 2, 3, 4]
    drop(input, 2)
    expect(input).toEqual([1, 2, 3, 4])
  })

  it('should return a new array', () => {
    const input = [1, 2, 3]
    expect(drop(input, 0)).not.toBe(input)
  })
})

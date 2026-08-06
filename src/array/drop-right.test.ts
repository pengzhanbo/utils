import { describe, expect, it } from 'vitest'
import { dropRight } from './drop-right.js'

describe('array > drop-right', () => {
  it('should drop the last n elements', () => {
    expect(dropRight([1, 2, 3], 2)).toEqual([1])
  })

  it('should default to dropping the last element', () => {
    expect(dropRight([1, 2, 3])).toEqual([1, 2])
  })

  it('should return the whole array when n is 0', () => {
    expect(dropRight([1, 2, 3], 0)).toEqual([1, 2, 3])
  })

  it('should return the whole array when n is negative', () => {
    expect(dropRight([1, 2, 3], -2)).toEqual([1, 2, 3])
  })

  it('should return an empty array when n exceeds the length', () => {
    expect(dropRight([1, 2, 3], 5)).toEqual([])
  })

  it('should return the whole array when n is Number.NaN', () => {
    expect(dropRight([1, 2, 3], Number.NaN)).toEqual([1, 2, 3])
  })

  it('should return the whole array when n is Infinity', () => {
    expect(dropRight([1, 2, 3], Infinity)).toEqual([1, 2, 3])
  })

  it('should truncate a non-integer n', () => {
    expect(dropRight([1, 2, 3, 4], 2.9)).toEqual([1, 2])
    expect(dropRight([1, 2, 3, 4], -1.5)).toEqual([1, 2, 3, 4])
  })

  it('should return an empty array for empty input', () => {
    expect(dropRight([], 2)).toEqual([])
  })

  it('should preserve object references', () => {
    const obj = { a: 1 }
    const result = dropRight([obj, { b: 2 }], 1)
    expect(result).toEqual([obj])
    expect(result[0]).toBe(obj)
  })

  it('should not mutate the input array', () => {
    const input = [1, 2, 3]
    dropRight(input, 2)
    expect(input).toEqual([1, 2, 3])
  })

  it('should return a new array', () => {
    const input = [1, 2, 3]
    expect(dropRight(input, 0)).not.toBe(input)
  })
})

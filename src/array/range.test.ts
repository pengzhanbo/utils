import { describe, expect, it } from 'vitest'
import { range } from './range'

describe('array > range', () => {
  it.each([
    [[0], []],
    [[5], [0, 1, 2, 3, 4]],
    [
      [1, 5],
      [1, 2, 3, 4],
    ],
    [
      [0, 8, 2],
      [0, 2, 4, 6],
    ],
    [
      [10, 0, -1],
      [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    ],
    [
      [10, 0, -2],
      [10, 8, 6, 4, 2],
    ],
    [
      [5, 0, -1],
      [5, 4, 3, 2, 1],
    ],
  ])('%s => %s', (input, expected) => {
    expect(range(...(input as [number, number, number]))).toEqual(expected)
  })

  it('should return empty array when step is negative and start < stop', () => {
    expect(range(0, 5, -1)).toEqual([])
  })

  it('should return empty array when step is positive and start > stop', () => {
    expect(range(10, 5, 1)).toEqual([])
  })

  it('should throw RangeError when step is zero', () => {
    expect(() => range(0, 3, 0)).toThrow(RangeError)
    expect(() => range(0, 3, 0)).toThrow('step must not be zero')
  })

  it('should throw RangeError when start or stop is Infinity', () => {
    expect(() => range(Infinity)).toThrow(RangeError)
    expect(() => range(0, Infinity, 1)).toThrow(RangeError)
    expect(() => range(-Infinity, 0)).toThrow(RangeError)
    expect(() => range(Infinity, 0, -1)).toThrow(RangeError)
  })

  it('should throw RangeError when step is Infinity or NaN', () => {
    expect(() => range(0, 5, Infinity)).toThrow(RangeError)
    expect(() => range(0, 5, -Infinity)).toThrow(RangeError)
    expect(() => range(0, 5, Number.NaN)).toThrow(RangeError)
    expect(() => range(0, 5, Infinity)).toThrow('start, stop and step must be finite numbers')
  })
})

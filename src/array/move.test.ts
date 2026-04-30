import { describe, expect, it } from 'vitest'
import { move } from './move'

describe('array > move', () => {
  it.each([
    [null, 0, 0, null],
    [[], 0, 0, []],
    [[0], 0, 0, [0]],
    [[1, 2, 3], 0, 0, [1, 2, 3]],
    [[1, 2, 3], 1, 2, [1, 3, 2]],
    [[1, 2, 3], 2, 1, [1, 3, 2]],
  ])('%s, from: %s, to: %s => %s', (input, from, to, expected) => {
    expect(move(input as number[], from, to)).toEqual(expected)
  })

  it('should clamp out-of-bounds from index', () => {
    const arr = [1, 2, 3]
    expect(move([...arr], 3, 1)).toEqual([1, 3, 2])
    expect(move([...arr], 100, 0)).toEqual([3, 1, 2])
  })

  it('should resolve negative from index from end of array', () => {
    expect(move([1, 2, 3], -1, 0)).toEqual([3, 1, 2])
    expect(move([1, 2, 3, 4, 5], -2, 1)).toEqual([1, 4, 2, 3, 5])
    expect(move([1, 2, 3], -10, 0)).toEqual([1, 2, 3])
  })

  it('should resolve negative to index from end of array', () => {
    expect(move([1, 2, 3], 0, -1)).toEqual([2, 3, 1])
    expect(move([1, 2, 3, 4, 5], 1, -2)).toEqual([1, 3, 4, 2, 5])
    expect(move([1, 2, 3], 2, -5)).toEqual([3, 1, 2])
  })

  it('should resolve both negative from and to indices', () => {
    expect(move([1, 2, 3, 4, 5], -1, -1)).toEqual([1, 2, 3, 4, 5])
    expect(move([1, 2, 3, 4, 5], -2, -1)).toEqual([1, 2, 3, 5, 4])
  })

  it('should clamp to index beyond array length to array length', () => {
    const arr = [1, 2, 3]
    expect(move(arr, 0, 100)).toEqual([2, 3, 1])
  })

  it('should clamp from index to valid range instead of inserting undefined', () => {
    const arr = [1, 2, 3]
    const result = move([...arr], 5, 1)
    expect(result).toEqual([1, 3, 2])
    expect(result.every((x) => x !== undefined)).toBe(true)
  })

  it('should throw TypeError when from is NaN', () => {
    expect(() => move([1, 2, 3], Number.NaN, 0)).toThrow(TypeError)
    expect(() => move([1, 2, 3], Number.NaN, 0)).toThrow('from and to must be integers')
  })

  it('should throw TypeError when to is NaN', () => {
    expect(() => move([1, 2, 3], 0, Number.NaN)).toThrow(TypeError)
    expect(() => move([1, 2, 3], 0, Number.NaN)).toThrow('from and to must be integers')
  })

  it('should throw TypeError when both from and to are NaN', () => {
    expect(() => move([1, 2, 3], Number.NaN, Number.NaN)).toThrow(TypeError)
  })
})

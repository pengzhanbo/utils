import { describe, expect, it } from 'vitest'
import { deepFlatten } from './deep-flatten.js'

describe('array > deepFlatten', () => {
  it('should flatten deeply nested arrays', () => {
    const result = deepFlatten([1, [2, [3, [4]]]])
    expect(result).toEqual([1, 2, 3, 4])
  })

  it('should flatten heterogeneous nested values', () => {
    const result = deepFlatten(['a', [1, [true, [null]]]])
    expect(result).toEqual(['a', 1, true, null])
  })

  it('should return an empty array for empty input', () => {
    expect(deepFlatten([])).toEqual([])
  })

  it('should return a new array for already-flat input', () => {
    const input = [1, 2, 3]
    const result = deepFlatten(input)
    expect(result).toEqual([1, 2, 3])
    expect(result).not.toBe(input)
  })

  it('should handle empty nested arrays', () => {
    expect(deepFlatten([[], [[]], 1])).toEqual([1])
  })

  it('should treat holes in sparse arrays as undefined', () => {
    const inner: number[] = []
    inner[0] = 2
    inner[2] = 4
    const input: (number | number[])[] = []
    input[0] = 1
    input[2] = inner
    const result = deepFlatten(input)
    expect(result).toEqual([1, undefined, 2, undefined, 4])
    expect(0 in result).toBe(true)
  })

  it('should not mutate the input array', () => {
    const input = [1, [2, [3]], 4]
    deepFlatten(input)
    expect(input).toEqual([1, [2, [3]], 4])
  })

  it('should preserve object references', () => {
    const obj = { a: 1 }
    const result = deepFlatten([obj, [obj]])
    expect(result).toEqual([obj, obj])
    expect(result[0]).toBe(obj)
  })

  it('should accept readonly input', () => {
    const input = [1, [2]] as const
    const result = deepFlatten(input)
    expect(result).toEqual([1, 2])
  })
})

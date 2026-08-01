import { describe, expect, it } from 'vitest'
import { compact } from './compact'

describe('array > compact', () => {
  it('should remove all falsy values', () => {
    const result = compact([0, 1, '', null, undefined, Number.NaN, false, 0n, 'a', true])
    expect(result).toEqual([1, 'a', true])
  })

  it('should return an empty array for all-falsy input', () => {
    const result = compact([0, '', null, undefined, Number.NaN, false, 0n])
    expect(result).toEqual([])
  })

  it('should keep all truthy elements', () => {
    const result = compact([1, 'a', true, {}, [], 1n])
    expect(result).toEqual([1, 'a', true, {}, [], 1n])
  })

  it('should return an empty array for empty input', () => {
    const result = compact([])
    expect(result).toEqual([])
  })

  it('should preserve the order of truthy elements', () => {
    const result = compact([null, 1, 0, 2, '', 3, undefined, 4, false, 5, Number.NaN, 6, 0n, 7])
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('should keep object references unchanged', () => {
    const obj = { a: 1 }
    const result = compact([null, obj, 0, undefined])
    expect(result).toEqual([obj])
    expect(result[0]).toBe(obj)
  })

  it('should not mutate the input array', () => {
    const input = [0, 1, '', 2, null]
    compact(input)
    expect(input).toEqual([0, 1, '', 2, null])
  })

  it('should return a new array', () => {
    const input = [1, 2, 3]
    const result = compact(input)
    expect(result).not.toBe(input)
  })
})

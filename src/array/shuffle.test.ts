import { describe, expect, it } from 'vitest'
import { shuffle } from './shuffle'

describe('array > shuffle', () => {
  it('should handle empty array', () => {
    expect(shuffle([])).toEqual([])
  })

  it('should handle single-element array', () => {
    expect(shuffle([1])).toEqual([1])
  })

  it('should preserve all elements after shuffle', () => {
    expect(shuffle([1, 2])).toHaveLength(2)
    expect(shuffle([1, 3, 5, 7, 9])).toHaveLength(5)
  })

  it('should return the same array reference', () => {
    const arr = [1, 2, 3]
    expect(shuffle(arr)).toBe(arr)
  })

  it('should preserve all elements (multiset equality)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = shuffle([...input])
    expect(result.sort((a, b) => a - b)).toEqual(input)
  })

  it('should handle arrays with duplicate values', () => {
    const input = [1, 1, 2, 2, 3, 3]
    const result = shuffle([...input])
    expect(result.sort((a, b) => a - b)).toEqual(input)
  })

  it('should handle arrays with mixed types', () => {
    const input = [1, 'a', true, null, undefined]
    const result = shuffle([...input])
    expect(result).toHaveLength(input.length)
    expect(result.sort()).toEqual([...input].sort())
  })

  it('should handle large arrays', () => {
    const input = Array.from({ length: 1000 }, (_, i) => i)
    const result = shuffle([...input])
    expect(result).toHaveLength(1000)
    expect(result.sort((a, b) => a - b)).toEqual(input)
  })

  it('should produce different orderings on average', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const results = new Set<string>()
    for (let i = 0; i < 100; i++) {
      results.add(shuffle([...input]).join(','))
    }
    expect(results.size).toBeGreaterThan(1)
  })
})

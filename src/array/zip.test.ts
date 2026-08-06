import { describe, expect, it } from 'vitest'
import { zip } from './zip.js'

describe('array > zip', () => {
  it('should zip arrays by index with the shortest length', () => {
    const result = zip([1, 2], ['a', 'b', 'c'])
    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
    ])
  })

  it('should zip arrays of equal length', () => {
    const result = zip([1, 2, 3], ['a', 'b', 'c'])
    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ])
  })

  it('should zip three arrays', () => {
    const result = zip([1, 2, 3], ['a', 'b'], [true, false, true])
    expect(result).toEqual([
      [1, 'a', true],
      [2, 'b', false],
    ])
  })

  it('should return an empty array for no arguments', () => {
    expect(zip()).toEqual([])
  })

  it('should zip a single array', () => {
    expect(zip([1, 2])).toEqual([[1], [2]])
  })

  it('should return an empty array when any input is empty', () => {
    expect(zip([], [1, 2])).toEqual([])
    expect(zip([1, 2], [])).toEqual([])
  })

  it('should keep object references without cloning', () => {
    const a = { a: 1 }
    const b = { b: 2 }
    const result = zip([a], [b])
    expect(result[0]![0]).toBe(a)
    expect(result[0]![1]).toBe(b)
  })

  it('should not mutate the input arrays', () => {
    const first = [1, 2]
    const second = ['a', 'b']
    zip(first, second)
    expect(first).toEqual([1, 2])
    expect(second).toEqual(['a', 'b'])
  })

  it('should handle arrays with mixed types', () => {
    const result = zip([1, 'x', null], [true, undefined, { n: 3 }])
    expect(result).toEqual([
      [1, true],
      ['x', undefined],
      [null, { n: 3 }],
    ])
  })
})

import { describe, expect, it } from 'vitest'
import { chunk } from './chunk'

describe('array > chunk', () => {
  it.each([
    [[1, 2, 3, 4, 5], 2, [[1, 2], [3, 4], [5]]],
    [
      [1, 2, 3, 4, 5],
      3,
      [
        [1, 2, 3],
        [4, 5],
      ],
    ],
    [[1, 2, 3, 4, 5], 1, [[1], [2], [3], [4], [5]]],
    [[1, 2, 3, 4, 5], undefined, [[1], [2], [3], [4], [5]]],
  ])('%s, size: %s => %s', (input, size, expected) => {
    expect(chunk(input, size)).toEqual(expected)
  })

  it('should truncate float size via parseInt', () => {
    expect(chunk([1, 2, 3, 4, 5], 3.9)).toEqual([
      [1, 2, 3],
      [4, 5],
    ])
    expect(chunk([1, 2, 3, 4, 5], 1.5)).toEqual([[1], [2], [3], [4], [5]])
  })

  it('should fallback to size=1 when parseInt result is invalid', () => {
    expect(chunk([1, 2, 3], 0)).toEqual([[1], [2], [3]])
    expect(chunk([1, 2, 3], 0.5)).toEqual([[1], [2], [3]])
    expect(chunk([1, 2, 3], Number.NaN)).toEqual([[1], [2], [3]])
    expect(chunk([1, 2, 3], Number.POSITIVE_INFINITY)).toEqual([[1], [2], [3]])
    expect(chunk([1, 2, 3], Number.NEGATIVE_INFINITY)).toEqual([[1], [2], [3]])
  })

  it('should fallback to size=1 when size is negative', () => {
    expect(chunk([1, 2, 3], -1)).toEqual([[1], [2], [3]])
    expect(chunk([1, 2, 3], -5)).toEqual([[1], [2], [3]])
  })
})

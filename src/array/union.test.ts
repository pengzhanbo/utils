import { describe, expect, it } from 'vitest'
import { union, unionBy } from './union'

describe('array > union', () => {
  it.each([
    [[], [], []],
    [[1, 2, 3], [], [1, 2, 3]],
    [[], [1, 2, 3], [1, 2, 3]],
    [
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ],
    [
      [1, 2, 3],
      [4, 5, 6],
      [1, 2, 3, 4, 5, 6],
    ],
    [
      [1, 2, 3],
      [3, 4, 5],
      [1, 2, 3, 4, 5],
    ],
  ])('%s, %s => %s', (a, b, expected) => {
    expect(union(a, b)).toEqual(expected)
  })
})

describe('array >unionBy', () => {
  it('should work with a `predicate`', () => {
    expect(unionBy([2.1], [1.2, 2.3], Math.floor)).toEqual([2.1, 1.2])
    expect(unionBy([{ x: 1 }], [{ x: 2 }, { x: 1 }], ({ x }) => x)).toEqual([{ x: 1 }, { x: 2 }])
  })
})

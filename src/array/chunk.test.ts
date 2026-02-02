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
})

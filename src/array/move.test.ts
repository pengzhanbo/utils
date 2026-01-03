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
    [[1, 2, 3], 3, 1, [1, undefined, 2, 3]],
  ])('%s, from: %s, to: %s => %s', (input, from, to, expected) => {
    expect(move(input as number[], from, to)).toEqual(expected)
  })
})

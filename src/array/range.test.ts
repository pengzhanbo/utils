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
      [0, 3, 0],
      [0, 1, 2],
    ],
  ])('%s => %s', (input, expected) => {
    expect(range(...(input as [number, number, number]))).toEqual(expected)
  })
})

import { describe, expect, it } from 'vitest'
import { shuffle } from './shuffle'

describe('array > shuffle', () => {
  it.each([
    [[]],
    [[1, 2]],
    [[1, 3, 5, 7, 9]],
  ])('%s', (input) => {
    expect(shuffle(input)).toHaveLength(input.length)
  })
})

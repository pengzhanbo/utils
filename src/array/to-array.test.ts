import { describe, expect, it } from 'vitest'
import { toArray } from './to-array'

describe('array > toArray', () => {
  it.each([
    [undefined, []],
    [null, []],
    [[], []],
    [false, [false]],
    [0, [0]],
    ['', ['']],
    ['foo', ['foo']],
    [['foo'], ['foo']],
  ])('%s => %s', (input, expected) => {
    expect(toArray(input)).toEqual(expected)
  })
})

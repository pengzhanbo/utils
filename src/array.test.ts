import { describe, expect, it } from 'vitest'
import { chunk, range, sortBy, toArray, uniq } from './array'

describe('toArray', () => {
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

describe('uniq', () => {
  it.each([
    [[undefined, undefined], [undefined]],
    [[null, null], [null]],
    [
      [true, true, false, false],
      [true, false],
    ],
    [
      [1, 1, 2, 3, 3],
      [1, 2, 3],
    ],
    [['foo', 'foo'], ['foo']],
  ])('%s => %s', (input, expected) => {
    expect(uniq(input as any)).toEqual(expected)
  })
})

it('range', () => {
  expect(range(0)).toEqual([])
  expect(range(2)).toEqual([0, 1])
  expect(range(1, 5)).toEqual([1, 2, 3, 4])
  expect(range(0, 8, 2)).toEqual([0, 2, 4, 6])
})

it(sortBy, () => {
  expect(sortBy([3, 4, 2, 5], v => v)).toEqual([2, 3, 4, 5])
  expect(sortBy([], v => v)).toEqual([])
  expect(
    sortBy(
      [
        { name: 'Mark', age: 20 },
        { name: 'John', age: 18 },
        { name: 'Jack', age: 21 },
        { name: 'Tom', age: 18 },
      ],
      v => v.age,
    ),
  ).toEqual([
    { name: 'John', age: 18 },
    { name: 'Tom', age: 18 },
    { name: 'Mark', age: 20 },
    { name: 'Jack', age: 21 },
  ])
})

it('chunk', () => {
  expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([
    [1, 2, 3],
    [4, 5],
  ])
  expect(chunk([1, 2, 3, 4, 5], 1)).toEqual([[1], [2], [3], [4], [5]])
})

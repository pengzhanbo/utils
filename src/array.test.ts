import { describe, expect, it } from 'vitest'
import { chunk, intersection, move, range, remove, shuffle, sortBy, toArray, union, uniq, uniqueBy } from './array'

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

describe('uniqueBy', () => {
  const equalFn = (l: { a: number }, r: { a: number }) => l.a === r.a
  it.each([
    [[], []],
    [[{ a: 2 }, { a: 1 }, { a: 3 }], [{ a: 2 }, { a: 1 }, { a: 3 }]],
    [[{ a: 2 }, { a: 1 }, { a: 2 }], [{ a: 2 }, { a: 1 }]],
  ])('(%s => %s', (input, expected) => {
    expect(uniqueBy(input, equalFn)).toEqual(expected)
  })
})

describe('remove', () => {
  it.each([
    [null, 0, null, false],
    [[], 0, [], false],
    [[1, 2, 3], 0, [1, 2, 3], false],
    [[1, 2, 3], 1, [2, 3], true],
    [[1, 2, 3], 2, [1, 3], true],
  ])('%s, remove value: %s => %s, removed: %s', (input, value, expected, removed) => {
    expect(remove(input as unknown as number[], value)).toEqual(removed)
    expect(input).toEqual(expected)
  })
})

describe('range', () => {
  it.each([
    [[0], []],
    [[5], [0, 1, 2, 3, 4]],
    [[1, 5], [1, 2, 3, 4]],
    [[0, 8, 2], [0, 2, 4, 6]],
    [[0, 3, 0], [0, 1, 2]],
  ])('%s => %s', (input, expected) => {
    expect(range(...(input as [number, number, number]))).toEqual(expected)
  })
})

describe('move', () => {
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

describe('shuffle', () => {
  it.each([
    [[]],
    [[1, 2]],
    [[1, 3, 5, 7, 9]],
  ])('%s', (input) => {
    expect(shuffle(input)).toHaveLength(input.length)
  })
})

describe('sortBy', () => {
  it.each([
    [[], (v: number) => v, []],
    [[3, 4, 2, 5], (v: number) => v, [2, 3, 4, 5]],
    [
      [
        { name: 'Mark', age: 20 },
        { name: 'John', age: 18 },
        { name: 'Jack', age: 21 },
        { name: 'Tom', age: 18 },
      ],
      (v: { name: string, age: number }) => v.age,
      [
        { name: 'John', age: 18 },
        { name: 'Tom', age: 18 },
        { name: 'Mark', age: 20 },
        { name: 'Jack', age: 21 },
      ],
    ],
  ])('%s', (input: unknown[], sortFn: (v: any) => number, expected) => {
    expect(sortBy(input, sortFn)).toEqual(expected)
  })
})

describe('chunk', () => {
  it.each([
    [[1, 2, 3, 4, 5], 2, [[1, 2], [3, 4], [5]]],
    [[1, 2, 3, 4, 5], 3, [[1, 2, 3], [4, 5]]],
    [[1, 2, 3, 4, 5], 1, [[1], [2], [3], [4], [5]]],
    [[1, 2, 3, 4, 5], undefined, [[1], [2], [3], [4], [5]]],
  ])('%s, size: %s => %s', (input, size, expected) => {
    expect(chunk(input, size)).toEqual(expected)
  })
})

describe('union', () => {
  it.each([
    [[], [], []],
    [[1, 2, 3], [], [1, 2, 3]],
    [[], [1, 2, 3], [1, 2, 3]],
    [[1, 2, 3], [1, 2, 3], [1, 2, 3]],
    [[1, 2, 3], [4, 5, 6], [1, 2, 3, 4, 5, 6]],
    [[1, 2, 3], [3, 4, 5], [1, 2, 3, 4, 5]],
  ])('%s, %s => %s', (a, b, expected) => {
    expect(union(a, b)).toEqual(expected)
  })
})

describe('intersection', () => {
  it.each([
    [[], [], []],
    [[1, 2, 3], [], []],
    [[], [1, 2, 3], []],
    [[1, 2, 3], [1, 2, 3], [1, 2, 3]],
    [[1, 2, 3], [4, 5, 6], []],
    [[1, 2, 3], [3, 4, 5], [3]],
  ])('%s, %s => %s', (a, b, expected) => {
    expect(intersection(a, b)).toEqual(expected)
  })
})

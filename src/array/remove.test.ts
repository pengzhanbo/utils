import { describe, expect, it } from 'vitest'
import { remove, removeBy } from './remove'

describe('array > remove', () => {
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

describe('array > removeBy', () => {
  interface V { a: number }

  const predicate = (item: V) => item.a === 2

  it.each([
    [null, null, false],
    [[], [], false],
    [
      [{ a: 1 }, { a: 3 }],
      [{ a: 1 }, { a: 3 }],
      false,
    ],
    [
      [{ a: 1 }, { a: 2 }, { a: 3 }],
      [{ a: 1 }, { a: 3 }],
      true,
    ],
  ])('%s, remove value: %s => %s, removed: %s', (input, expected, removed) => {
    expect(removeBy(input as unknown as V[], predicate)).toEqual(removed)
    expect(input).toEqual(expected)
  })
})

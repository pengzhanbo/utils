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

  it('should remove NaN from array', () => {
    const arr = [1, Number.NaN, 3]
    expect(remove(arr, Number.NaN)).toBe(true)
    expect(arr).toEqual([1, 3])
  })

  it('should return false when NaN is not in array', () => {
    const arr = [1, 2, 3]
    expect(remove(arr, Number.NaN)).toBe(false)
    expect(arr).toEqual([1, 2, 3])
  })
})

describe('array > removeBy', () => {
  interface V {
    a: number
  }

  const predicate = (item: V) => item.a === 2

  it.each([
    [null, null, false],
    [[], [], false],
    [[{ a: 1 }, { a: 3 }], [{ a: 1 }, { a: 3 }], false],
    [[{ a: 1 }, { a: 2 }, { a: 3 }], [{ a: 1 }, { a: 3 }], true],
  ])('%s, remove value: %s => %s, removed: %s', (input, expected, removed) => {
    expect(removeBy(input as unknown as V[], predicate)).toEqual(removed)
    expect(input).toEqual(expected)
  })
})

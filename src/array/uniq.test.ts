import { describe, expect, it } from 'vitest'
import { uniq, uniqBy, uniqWith } from './uniq'

describe('array > uniq', () => {
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

  it('should return empty array for empty input', () => {
    expect(uniq([])).toEqual([])
  })

  it('should handle NaN values', () => {
    expect(uniq([Number.NaN, Number.NaN])).toEqual([Number.NaN])
    expect(uniq([1, Number.NaN, 1, Number.NaN])).toEqual([1, Number.NaN])
  })

  it('should handle mixed type arrays', () => {
    expect(uniq([1, '1', true])).toEqual([1, '1', true])
    expect(uniq([0, false, '0'])).toEqual([0, false, '0'])
  })

  it('should not deduplicate different object references', () => {
    const obj1 = { a: 1 }
    const obj2 = { a: 1 }
    expect(uniq([obj1, obj2])).toEqual([obj1, obj2])
    expect(uniq([obj1, obj1])).toEqual([obj1])
  })
})

describe('array > uniqBy', () => {
  it.each([
    [[], []],
    [
      [{ a: 2 }, { a: 1 }, { a: 3 }],
      [{ a: 2 }, { a: 1 }, { a: 3 }],
    ],
    [
      [{ a: 2 }, { a: 1 }, { a: 2 }],
      [{ a: 2 }, { a: 1 }],
    ],
  ])('(%s => %s', (input, expected) => {
    expect(uniqBy(input, (item) => item.a)).toEqual(expected)
  })

  it('should work with Math.floor', () => {
    expect(uniqBy([1.1, 1.2, 2.1, 2.2], Math.floor)).toEqual([1.1, 2.1])
  })
})

describe('array > uniqWith', () => {
  interface V {
    a: number
  }

  const equalFn = (l: V, r: V) => l.a === r.a

  it.each([
    [[], []],
    [
      [{ a: 2 }, { a: 1 }, { a: 3 }],
      [{ a: 2 }, { a: 1 }, { a: 3 }],
    ],
    [
      [{ a: 2 }, { a: 1 }, { a: 2 }],
      [{ a: 2 }, { a: 1 }],
    ],
  ])('(%s => %s', (input, expected) => {
    expect(uniqWith(input, equalFn)).toEqual(expected)
  })
})

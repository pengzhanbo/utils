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

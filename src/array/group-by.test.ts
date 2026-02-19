import { describe, expect, it } from 'vitest'
import { groupBy } from './group-by'

describe('array > groupBy', () => {
  it('should group elements by iteratee function', () => {
    const input = [
      { type: 'a', val: 1 },
      { type: 'b', val: 2 },
      { type: 'a', val: 3 },
    ]
    const result = groupBy(input, (x) => x.type)
    expect(result).toEqual({
      a: [
        { type: 'a', val: 1 },
        { type: 'a', val: 3 },
      ],
      b: [{ type: 'b', val: 2 }],
    })
  })

  it('should group numbers by Math.floor', () => {
    const result = groupBy([6.1, 4.2, 6.3], Math.floor)
    expect(result).toEqual({
      6: [6.1, 6.3],
      4: [4.2],
    })
  })

  it('should group strings by length', () => {
    const result = groupBy(['one', 'two', 'three'], (x) => x.length)
    expect(result).toEqual({
      3: ['one', 'two'],
      5: ['three'],
    })
  })

  it('should return empty object for empty array', () => {
    const result = groupBy([], (x) => x)
    expect(result).toEqual({})
  })

  it('should handle single element array', () => {
    const result = groupBy([1], (x) => x)
    expect(result).toEqual({ 1: [1] })
  })

  it('should group by string key', () => {
    const result = groupBy(['apple', 'banana', 'apricot'], (x) => x[0] as PropertyKey)
    expect(result).toEqual({
      a: ['apple', 'apricot'],
      b: ['banana'],
    })
  })

  it('should handle null and undefined keys', () => {
    const input = [null, undefined, null, undefined]
    const result = groupBy(input, (x) => String(x))
    expect(result).toEqual({
      null: [null, null],
      undefined: [undefined, undefined],
    })
  })

  it('should preserve order within groups', () => {
    const input = [
      { id: 1, group: 'a' },
      { id: 2, group: 'b' },
      { id: 3, group: 'a' },
      { id: 4, group: 'a' },
      { id: 5, group: 'b' },
    ]
    const result = groupBy(input, (x) => x.group)
    expect(result.a!.map((x) => x.id)).toEqual([1, 3, 4])
    expect(result.b!.map((x) => x.id)).toEqual([2, 5])
  })

  it('should handle numeric keys', () => {
    const result = groupBy([1, 2, 3, 4, 5], (x) => x % 2)
    expect(result).toEqual({
      0: [2, 4],
      1: [1, 3, 5],
    })
  })

  it('should handle symbol keys', () => {
    const symA = Symbol('a')
    const symB = Symbol('b')
    const input = [
      { key: symA, val: 1 },
      { key: symB, val: 2 },
      { key: symA, val: 3 },
    ]
    const result = groupBy(input, (x) => x.key as PropertyKey)
    expect(result[symA]).toEqual([
      { key: symA, val: 1 },
      { key: symA, val: 3 },
    ])
    expect(result[symB]).toEqual([{ key: symB, val: 2 }])
  })
})

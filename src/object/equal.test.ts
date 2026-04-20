import { describe, expect, it } from 'vitest'
import { deepEqual } from './equal'

describe('deepEqual', () => {
  it('should return true for primitives', () => {
    expect(deepEqual(1, 1)).toBe(true)
    expect(deepEqual(undefined, undefined)).toBe(true)
    expect(deepEqual(null, null)).toBe(true)
    expect(deepEqual(false, false)).toBe(true)
    expect(deepEqual('', '')).toBe(true)
    expect(deepEqual(Number.NaN, Number.NaN)).toBe(true)
  })

  it('should return false for different primitives', () => {
    expect(deepEqual(+0, -0)).toBe(false)
    expect(deepEqual(1, 2)).toBe(false)
    expect(deepEqual(undefined, null)).toBe(false)
    expect(deepEqual(Symbol('s'), Symbol('s'))).toBe(false)
    expect(deepEqual(Symbol('s'), Symbol('t'))).toBe(false)
  })

  it('should compare arrays deeply', () => {
    expect(deepEqual([1, 2], [1, 2])).toBe(true)
    expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true)
    expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true)
  })

  it('should return false for arrays with different lengths', () => {
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
    expect(deepEqual([1], [])).toBe(false)
  })

  it('should compare objects deeply', () => {
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true)
    expect(deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 2] } })).toBe(true)
    expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true)
  })

  it('should return false for objects with different keys', () => {
    expect(deepEqual({ a: 1 }, { a: 1, b: 1 })).toBe(false)
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
    expect(deepEqual({}, { a: 1 })).toBe(false)
  })

  it('should compare Date objects', () => {
    const date1 = new Date('2024-01-01')
    const date2 = new Date('2024-01-01')
    const date3 = new Date('2024-01-02')

    expect(deepEqual(date1, date2)).toBe(true)
    expect(deepEqual(date1, date3)).toBe(false)
  })

  it('should compare RegExp objects', () => {
    expect(deepEqual(/abc/, /abc/)).toBe(true)
    expect(deepEqual(/abc/i, /abc/i)).toBe(true)
    expect(deepEqual(/abc/g, /abc/g)).toBe(true)
    expect(deepEqual(/abc/i, /abc/)).toBe(false)
    expect(deepEqual(/abc/, /abcd/)).toBe(false)
    expect(deepEqual(/abc/g, /abc/i)).toBe(false)
  })

  it('should compare Set objects', () => {
    const set1 = new Set([1, 2, 3])
    const set2 = new Set([1, 2, 3])
    const set3 = new Set([1, 2])
    const set4 = new Set([1, 2, 4])

    expect(deepEqual(set1, set2)).toBe(true)
    expect(deepEqual(set1, set3)).toBe(false)
    expect(deepEqual(set1, set4)).toBe(false)
  })

  it('should compare Map objects', () => {
    const map1 = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const map2 = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const map3 = new Map([
      ['a', 1],
      ['b', 3],
    ])
    const map4 = new Map([['a', 1]])

    expect(deepEqual(map1, map2)).toBe(true)
    expect(deepEqual(map1, map3)).toBe(false)
    expect(deepEqual(map1, map4)).toBe(false)
  })

  it('should return false for different types', () => {
    expect(deepEqual(1, '1')).toBe(false)
    expect(deepEqual(null, undefined)).toBe(false)
    expect(deepEqual([], {})).toBe(false)
    expect(deepEqual({}, [])).toBe(false)
  })
})

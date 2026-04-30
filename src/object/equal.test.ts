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

  it('should return false for different types', () => {
    expect(deepEqual(1, '1')).toBe(false)
    expect(deepEqual(null, undefined)).toBe(false)
    expect(deepEqual([], {})).toBe(false)
    expect(deepEqual({}, [])).toBe(false)
    expect(deepEqual(1, true)).toBe(false)
    expect(deepEqual('1', 1)).toBe(false)
  })

  it('should return false when one side is null', () => {
    expect(deepEqual(null, {})).toBe(false)
    expect(deepEqual({}, null)).toBe(false)
    expect(deepEqual(null, [])).toBe(false)
    expect(deepEqual([], null)).toBe(false)
  })

  it('should return false for number vs object', () => {
    expect(deepEqual(1, {})).toBe(false)
    expect(deepEqual({}, 1)).toBe(false)
  })

  it('should return false for string vs object', () => {
    expect(deepEqual('a', {})).toBe(false)
    expect(deepEqual({}, 'a')).toBe(false)
  })

  it('should return false for boolean vs object', () => {
    expect(deepEqual(true, {})).toBe(false)
  })

  it('should return false for unknown object types', () => {
    expect(deepEqual(new WeakMap(), new WeakMap())).toBe(false)
    expect(deepEqual(new WeakRef({}), new WeakRef({}))).toBe(false)
    expect(deepEqual(new Promise(() => {}), new Promise(() => {}))).toBe(false)
    expect(
      deepEqual(
        () => {},
        () => {},
      ),
    ).toBe(false)
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

  it('should return false for arrays with different elements', () => {
    expect(deepEqual([1, 2], [1, 3])).toBe(false)
    expect(deepEqual([1], [2])).toBe(false)
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

  it('should return false for objects with undefined values but different keys', () => {
    expect(deepEqual({ a: 1, b: undefined }, { a: 1, c: undefined })).toBe(false)
    expect(deepEqual({ a: 1 }, { a: 1, b: undefined })).toBe(false)
    expect(deepEqual({ a: 1, b: undefined }, { a: 1 })).toBe(false)
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

  it('should compare Map objects with nested values', () => {
    const map1 = new Map([['key', { a: 1 }]])
    const map2 = new Map([['key', { a: 1 }]])
    const map3 = new Map([['key', { a: 2 }]])

    expect(deepEqual(map1, map2)).toBe(true)
    expect(deepEqual(map1, map3)).toBe(false)
  })

  it('should return true for same reference', () => {
    const obj = { a: 1 }
    expect(deepEqual(obj, obj)).toBe(true)
    const arr = [1, 2]
    expect(deepEqual(arr, arr)).toBe(true)
  })

  it('should handle bigint values', () => {
    expect(deepEqual(1n, 1n)).toBe(true)
    expect(deepEqual(1n, 2n)).toBe(false)
  })

  it('should compare Set objects with object elements by deep equality', () => {
    const set1 = new Set([{ a: 1 }, { b: 2 }])
    const set2 = new Set([{ a: 1 }, { b: 2 }])
    const set3 = new Set([{ a: 1 }, { b: 3 }])

    expect(deepEqual(set1, set2)).toBe(true)
    expect(deepEqual(set1, set3)).toBe(false)
  })

  it('should return false when Map1 has a primitive key that Map2 lacks', () => {
    const m1 = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const m2 = new Map([
      ['a', 1],
      ['c', 2],
    ])
    expect(deepEqual(m1, m2)).toBe(false)
  })

  it('should compare Map objects with object keys by deep equality', () => {
    const key1a = { id: 1 }
    const key1b = { id: 1 }
    const key2a = { id: 2 }
    const key2b = { id: 2 }

    const map1 = new Map([
      [key1a, 'val1'],
      [key2a, 'val2'],
    ])
    const map2 = new Map([
      [key1b, 'val1'],
      [key2b, 'val2'],
    ])

    expect(deepEqual(map1, map2)).toBe(true)
  })

  it('should compare Map objects with object keys and different values', () => {
    const key1a = { id: 1 }
    const key1b = { id: 1 }

    const map1 = new Map([[key1a, { x: 1 }]])
    const map2 = new Map([[key1b, { x: 2 }]])

    expect(deepEqual(map1, map2)).toBe(false)
  })

  it('should compare Map objects with different object keys', () => {
    const key1 = { id: 1 }
    const key2 = { id: 2 }

    const map1 = new Map([[key1, 'val']])
    const map2 = new Map([[key2, 'val']])

    expect(deepEqual(map1, map2)).toBe(false)
  })

  it('should compare Map objects with number keys', () => {
    const map1 = new Map([
      [1, 'a'],
      [2, 'b'],
    ])
    const map2 = new Map([
      [1, 'a'],
      [2, 'b'],
    ])
    const map3 = new Map([
      [1, 'a'],
      [3, 'b'],
    ])

    expect(deepEqual(map1, map2)).toBe(true)
    expect(deepEqual(map1, map3)).toBe(false)
  })

  it('should return false when Map primitive key values differ', () => {
    const map1 = new Map([['a', 1]])
    const map2 = new Map([['a', 2]])
    expect(deepEqual(map1, map2)).toBe(false)
  })

  it('should handle different types across object boundaries', () => {
    expect(deepEqual(new Date(), new Set())).toBe(false)
    expect(deepEqual(new Map(), new Set())).toBe(false)
    expect(deepEqual([], new Set())).toBe(false)
  })

  it('should handle circular references in objects', () => {
    const obj1: any = { a: 1 }
    obj1.self = obj1
    const obj2: any = { a: 1 }
    obj2.self = obj2

    expect(deepEqual(obj1, obj2)).toBe(true)
  })

  it('should handle circular references in arrays', () => {
    const arr1: any[] = [1, 2]
    arr1.push(arr1)
    const arr2: any[] = [1, 2]
    arr2.push(arr2)

    expect(deepEqual(arr1, arr2)).toBe(true)
  })

  it('should handle different circular references', () => {
    const obj1: any = { a: 1 }
    obj1.self = obj1
    const obj2: any = { a: 1 }
    const other: any = { b: 2 }
    obj2.self = other

    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  it('should handle mutual circular references', () => {
    const obj1: any = { a: 1 }
    const obj2: any = { b: 2 }
    obj1.ref = obj2
    obj2.ref = obj1

    const obj3: any = { a: 1 }
    const obj4: any = { b: 2 }
    obj3.ref = obj4
    obj4.ref = obj3

    expect(deepEqual(obj1, obj3)).toBe(true)
  })
})

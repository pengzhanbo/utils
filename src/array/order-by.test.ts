import { describe, expect, it } from 'vitest'
import { orderBy } from './order-by'

describe('array > orderBy', () => {
  it('should return an empty array if the input array is empty', () => {
    expect(orderBy([], [], [])).toEqual([])
  })

  it('should return a copy of single-element array', () => {
    const arr = [{ a: 1 }]
    const result = orderBy(arr, ['a'])
    expect(result).toEqual([{ a: 1 }])
    expect(result).not.toBe(arr)
  })

  it('should handle single-element array with function accord', () => {
    expect(orderBy([42], (x) => x)).toEqual([42])
  })

  it('should order strings in ascending order', () => {
    expect(orderBy(['barney', 'fred', 'pebbles'], (item) => item)).toEqual([
      'barney',
      'fred',
      'pebbles',
    ])

    expect(orderBy(['pebbles', 'fred', 'barney'], (item) => item)).toEqual([
      'barney',
      'fred',
      'pebbles',
    ])
  })

  it('should order strings in descending order', () => {
    expect(orderBy(['barney', 'fred', 'pebbles'], (item) => item, ['desc'])).toEqual([
      'pebbles',
      'fred',
      'barney',
    ])
  })

  it('should order numbers in ascending order', () => {
    expect(orderBy([4, 2, 8, 6], (item) => item)).toEqual([2, 4, 6, 8])
    expect(orderBy([112, 223, 101, 88], (item) => item)).toEqual([88, 101, 112, 223])
  })

  it('should order numbers in descending order', () => {
    expect(orderBy([4, 2, 8, 6], (item) => item, ['desc'])).toEqual([8, 6, 4, 2])
  })

  interface User {
    user: string
    age: number
  }

  const users: User[] = [
    { user: 'fred', age: 48 },
    { user: 'barney', age: 34 },
    { user: 'fred', age: 40 },
    { user: 'barney', age: 36 },
  ]

  it('should order objects by a single property in ascending order', () => {
    expect(orderBy(users, ['user'])).toEqual([
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
    ])
  })

  it('should order objects by a single property in descending order', () => {
    expect(orderBy(users, ['user'], ['desc'])).toEqual([
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
    ])
  })

  it('should order objects by multiple properties', () => {
    expect(orderBy(users, ['user', 'age'], ['asc', 'desc'])).toEqual([
      { user: 'barney', age: 36 },
      { user: 'barney', age: 34 },
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
    ])
  })

  const users2 = [
    { user: 'fred', age: 48 },
    { user: 'barney', age: 36 },
    { user: 'fred', age: 40 },
    { user: 'barney', age: 34 },
  ]

  it('should extend orders if orders length is less than keys length', () => {
    expect(orderBy(users2, ['user', 'age'], ['asc'])).toEqual([
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'fred', age: 48 },
    ])
  })

  it('should order objects by criteria functions', () => {
    expect(orderBy(users2, [(obj) => obj.user, (obj) => obj.age], ['asc'])).toEqual([
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'fred', age: 48 },
    ])
  })

  it('should use default ascending order when orders is not provided', () => {
    expect(orderBy([3, 1, 2], (x) => x)).toEqual([1, 2, 3])
  })

  it('should use default ascending order with empty orders array', () => {
    expect(orderBy([3, 1, 2], (x) => x, [])).toEqual([1, 2, 3])
  })

  it('should handle single accord with single order', () => {
    expect(orderBy(users2, ['age'], ['desc'])).toEqual([
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
      { user: 'barney', age: 36 },
      { user: 'barney', age: 34 },
    ])
  })

  it('should handle single accord as non-array value', () => {
    expect(orderBy(users2, 'age')).toEqual([
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'fred', age: 48 },
    ])
  })

  it('should handle single order as non-array value', () => {
    expect(orderBy(users2, ['age'], 'desc')).toEqual([
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
      { user: 'barney', age: 36 },
      { user: 'barney', age: 34 },
    ])
  })

  it('should not mutate the original array', () => {
    const original = [3, 1, 2]
    const copy = [...original]
    orderBy(original, (x) => x)
    expect(original).toEqual(copy)
  })

  it('should handle equal values gracefully', () => {
    expect(orderBy([1, 1, 1], (x) => x)).toEqual([1, 1, 1])
    expect(orderBy([{ a: 1 }, { a: 1 }], ['a'])).toEqual([{ a: 1 }, { a: 1 }])
  })

  it('should handle mixed function and key accords', () => {
    const data = [
      { name: 'a', score: 3 },
      { name: 'b', score: 1 },
      { name: 'c', score: 2 },
    ]
    expect(orderBy(data, [(d) => d.score], ['asc'])).toEqual([
      { name: 'b', score: 1 },
      { name: 'c', score: 2 },
      { name: 'a', score: 3 },
    ])
  })

  it('should sort NaN values to the end', () => {
    const result = orderBy([3, Number.NaN, 1, Number.NaN, 2], (x) => x)
    expect(result.slice(0, 3)).toEqual([1, 2, 3])
    expect(Number.isNaN(result[3]!)).toBe(true)
    expect(Number.isNaN(result[4]!)).toBe(true)
  })

  it('should sort undefined values to the end', () => {
    const result = orderBy([3, undefined, 1, undefined, 2], (x) => x)
    expect(result.slice(0, 3)).toEqual([1, 2, 3])
    expect(result[3]).toBeUndefined()
    expect(result[4]).toBeUndefined()
  })

  it('should sort NaN and undefined values to the end', () => {
    const result = orderBy([Number.NaN, 2, undefined, 1], (x) => x)
    expect(result.slice(0, 2)).toEqual([1, 2])
  })

  it('should be stable when sorting array with multiple NaN values', () => {
    const result = orderBy([Number.NaN, Number.NaN, 3, 1], (x) => x)
    expect(result.slice(0, 2)).toEqual([1, 3])
    expect(Number.isNaN(result[2]!)).toBe(true)
    expect(Number.isNaN(result[3]!)).toBe(true)
  })

  it('should be stable when sorting array with multiple undefined values', () => {
    const result = orderBy([undefined, undefined, 3, 1], (x) => x)
    expect(result.slice(0, 2)).toEqual([1, 3])
    expect(result[2]).toBeUndefined()
    expect(result[3]).toBeUndefined()
  })

  it('should sort objects with NaN and undefined keys to the end', () => {
    const data = [{ v: Number.NaN }, { v: 3 }, { v: undefined }, { v: 1 }]
    const result = orderBy(data, [(d) => d.v], ['asc'])
    expect(result[0]!.v).toBe(1)
    expect(result[1]!.v).toBe(3)
  })
})

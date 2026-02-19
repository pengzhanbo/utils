import { describe, expect, it } from 'vitest'
import { keyBy } from './key-by'

describe('array > keyBy', () => {
  it('should create an object keyed by iteratee function', () => {
    const input = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]
    const result = keyBy(input, (x) => x.id)
    expect(result).toEqual({
      1: { id: 1, name: 'a' },
      2: { id: 2, name: 'b' },
    })
  })

  it('should use the last element for duplicate keys', () => {
    const input = [
      { id: 1, name: 'first' },
      { id: 2, name: 'second' },
      { id: 1, name: 'third' },
    ]
    const result = keyBy(input, (x) => x.id)
    expect(result).toEqual({
      1: { id: 1, name: 'third' },
      2: { id: 2, name: 'second' },
    })
  })

  it('should return empty object for empty array', () => {
    const result = keyBy([], (x) => x)
    expect(result).toEqual({})
  })

  it('should handle single element array', () => {
    const result = keyBy([{ id: 1 }], (x) => x.id)
    expect(result).toEqual({ 1: { id: 1 } })
  })

  it('should key by string property', () => {
    const input = [
      { name: 'alice', age: 25 },
      { name: 'bob', age: 30 },
    ]
    const result = keyBy(input, (x) => x.name)
    expect(result).toEqual({
      alice: { name: 'alice', age: 25 },
      bob: { name: 'bob', age: 30 },
    })
  })

  it('should key by computed value', () => {
    const result = keyBy(['one', 'two', 'three'], (x) => x.length)
    expect(result).toEqual({
      3: 'two',
      5: 'three',
    })
  })

  it('should handle numeric keys', () => {
    const result = keyBy([1, 2, 3], (x) => x * 2)
    expect(result).toEqual({
      2: 1,
      4: 2,
      6: 3,
    })
  })

  it('should handle symbol keys', () => {
    const symA = Symbol('a')
    const symB = Symbol('b')
    const input = [
      { key: symA, val: 1 },
      { key: symB, val: 2 },
    ]
    const result = keyBy(input, (x) => x.key as PropertyKey)
    expect(result[symA]).toEqual({ key: symA, val: 1 })
    expect(result[symB]).toEqual({ key: symB, val: 2 })
  })

  it('should handle array of primitives', () => {
    const result = keyBy(['a', 'b', 'c'], (x) => x.toUpperCase())
    expect(result).toEqual({
      A: 'a',
      B: 'b',
      C: 'c',
    })
  })

  it('should work with complex objects', () => {
    interface User {
      id: number
      profile: { name: string }
    }
    const input: User[] = [
      { id: 1, profile: { name: 'Alice' } },
      { id: 2, profile: { name: 'Bob' } },
    ]
    const result = keyBy(input, (x) => x.id)
    expect(result[1]!.profile.name).toBe('Alice')
    expect(result[2]!.profile.name).toBe('Bob')
  })
})

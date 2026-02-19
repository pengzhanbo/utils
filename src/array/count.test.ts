import { describe, expect, it } from 'vitest'
import { count, countBy } from './count'

describe('array > count', () => {
  it('should count elements that satisfy the predicate', () => {
    expect(count([1, 2, 3, 4, 5], (n) => n > 2)).toBe(3)
    expect(count([1, 2, 3, 4, 5], (n) => n > 5)).toBe(0)
    expect(count([1, 2, 3, 4, 5], (n) => n >= 1)).toBe(5)
  })

  it('should return 0 for empty array', () => {
    expect(count([], (x) => x)).toBe(0)
  })

  it('should count strings by length', () => {
    expect(count(['a', 'bb', 'ccc', 'dd'], (s) => s.length > 1)).toBe(3)
  })

  it('should count objects by property', () => {
    const input = [{ active: true }, { active: false }, { active: true }]
    expect(count(input, (x) => x.active)).toBe(2)
  })

  it('should handle single element array', () => {
    expect(count([1], (x) => x === 1)).toBe(1)
    expect(count([1], (x) => x === 2)).toBe(0)
  })

  it('should work with complex predicates', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    expect(count(input, (n) => n % 2 === 0 && n > 5)).toBe(3)
  })
})

describe('array > countBy', () => {
  it('should count occurrences by iteratee function', () => {
    const result = countBy(['one', 'two', 'three'], (x) => x.length)
    expect(result).toEqual({ 3: 2, 5: 1 })
  })

  it('should count by Math.floor', () => {
    const result = countBy([6.1, 4.2, 6.3], Math.floor)
    expect(result).toEqual({ 6: 2, 4: 1 })
  })

  it('should return empty object for empty array', () => {
    const result = countBy([], (x) => x)
    expect(result).toEqual({})
  })

  it('should handle single element array', () => {
    const result = countBy([1], (x) => x)
    expect(result).toEqual({ 1: 1 })
  })

  it('should count by object property', () => {
    const input = [{ type: 'a' }, { type: 'b' }, { type: 'a' }, { type: 'a' }]
    const result = countBy(input, (x) => x.type)
    expect(result).toEqual({ a: 3, b: 1 })
  })

  it('should count by computed key', () => {
    const result = countBy([1, 2, 3, 4, 5], (x) => (x % 2 === 0 ? 'even' : 'odd'))
    expect(result).toEqual({ odd: 3, even: 2 })
  })

  it('should handle boolean keys', () => {
    const result = countBy([1, 2, 3, 4, 5, 6], (x) => String(x > 3) as PropertyKey)
    expect(result).toEqual({ false: 3, true: 3 })
  })

  it('should handle string keys', () => {
    const result = countBy(['apple', 'banana', 'apricot', 'avocado'], (x) => x[0] as PropertyKey)
    expect(result).toEqual({ a: 3, b: 1 })
  })

  it('should handle numeric keys', () => {
    const result = countBy([1, 1, 2, 2, 2, 3], (x) => x)
    expect(result).toEqual({ 1: 2, 2: 3, 3: 1 })
  })

  it('should handle symbol keys', () => {
    const symA = Symbol('a')
    const symB = Symbol('b')
    const input = [symA, symB, symA, symA]
    const result = countBy(input, (x) => x as PropertyKey)
    expect(result[symA]).toBe(3)
    expect(result[symB]).toBe(1)
  })

  it('should handle null and undefined keys', () => {
    const input = [null, undefined, null, undefined, null]
    const result = countBy(input, (x) => String(x) as PropertyKey)
    expect(result).toEqual({ null: 3, undefined: 2 })
  })
})

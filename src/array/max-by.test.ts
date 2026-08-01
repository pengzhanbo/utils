import { describe, expect, it } from 'vitest'
import { maxBy } from './max-by'

describe('array > max-by', () => {
  it('should return undefined for an empty array', () => {
    const result = maxBy<number>([], (n) => n)
    expect(result).toBeUndefined()
  })

  it('should find the maximum number', () => {
    const result = maxBy([3, 1, 4, 1, 5, 9, 2, 6], (n) => n)
    expect(result).toBe(9)
  })

  it('should find the lexicographically largest string', () => {
    const result = maxBy(['pear', 'apple', 'banana'], (s) => s)
    expect(result).toBe('pear')
  })

  it('should compare string iteratee values lexicographically', () => {
    const result = maxBy(['bb', 'a', 'cc'], (s) => s)
    expect(result).toBe('cc')
  })

  it('should keep the first element on ties', () => {
    const first = { n: 3 }
    const second = { n: 3 }
    const result = maxBy([first, second, { n: 1 }], (u) => u.n)
    expect(result).toBe(first)
  })

  it('should return the only element for a single-element array', () => {
    const result = maxBy([42], (n) => n)
    expect(result).toBe(42)
  })

  it('should work with object properties', () => {
    const result = maxBy(
      [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 17 },
        { name: 'Charlie', age: 30 },
      ],
      (x) => x.age,
    )
    expect(result).toEqual({ name: 'Charlie', age: 30 })
  })

  it('should work with negative numbers', () => {
    const result = maxBy([-5, 0, -10, 3], (n) => n)
    expect(result).toBe(3)
  })

  it('should not mutate the input array', () => {
    const input = [3, 1, 2]
    maxBy(input, (n) => n)
    expect(input).toEqual([3, 1, 2])
  })

  it('should pass each item to the iteratee', () => {
    const calls: number[] = []
    maxBy([2, 4, 6], (n) => {
      calls.push(n)
      return n
    })
    expect(calls).toEqual([2, 4, 6])
  })
})

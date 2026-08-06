import { describe, expect, it } from 'vitest'
import { minBy } from './min-by.js'

describe('array > min-by', () => {
  it('should return undefined for an empty array', () => {
    const result = minBy<number>([], (n) => n)
    expect(result).toBeUndefined()
  })

  it('should find the minimum number', () => {
    const result = minBy([3, 1, 4, 1, 5, 9, 2, 6], (n) => n)
    expect(result).toBe(1)
  })

  it('should find the lexicographically smallest string', () => {
    const result = minBy(['pear', 'apple', 'banana'], (s) => s)
    expect(result).toBe('apple')
  })

  it('should compare string iteratee values lexicographically', () => {
    const result = minBy(['bb', 'a', 'cc'], (s) => s)
    expect(result).toBe('a')
  })

  it('should keep the first element on ties', () => {
    const first = { n: 1 }
    const second = { n: 1 }
    const result = minBy([first, second, { n: 2 }], (u) => u.n)
    expect(result).toBe(first)
  })

  it('should return the only element for a single-element array', () => {
    const result = minBy([42], (n) => n)
    expect(result).toBe(42)
  })

  it('should work with object properties', () => {
    const result = minBy(
      [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 17 },
        { name: 'Charlie', age: 30 },
      ],
      (x) => x.age,
    )
    expect(result).toEqual({ name: 'Bob', age: 17 })
  })

  it('should work with negative numbers', () => {
    const result = minBy([-5, 0, -10, 3], (n) => n)
    expect(result).toBe(-10)
  })

  it('should not mutate the input array', () => {
    const input = [3, 1, 2]
    minBy(input, (n) => n)
    expect(input).toEqual([3, 1, 2])
  })

  it('should pass each item to the iteratee', () => {
    const calls: number[] = []
    minBy([2, 4, 6], (n) => {
      calls.push(n)
      return n
    })
    expect(calls).toEqual([2, 4, 6])
  })
})

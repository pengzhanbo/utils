import { describe, expect, it } from 'vitest'
import { sumBy } from './sum-by.js'

describe('array > sum-by', () => {
  it('should return 0 for an empty array', () => {
    const result = sumBy<number>([], (n) => n)
    expect(result).toBe(0)
  })

  it('should sum object property values', () => {
    const result = sumBy([{ p: 10 }, { p: 20 }], (o) => o.p)
    expect(result).toBe(30)
  })

  it('should handle negative values', () => {
    const result = sumBy([5, -3, 2, -10], (n) => n)
    expect(result).toBe(-6)
  })

  it('should handle float values', () => {
    const result = sumBy([1.5, 2.25, 0.25], (n) => n)
    expect(result).toBe(4)
  })

  it('should handle a single element', () => {
    const result = sumBy([7], (n) => n)
    expect(result).toBe(7)
  })

  it('should return 0 when all values are zero', () => {
    const result = sumBy([{ p: 0 }, { p: 0 }], (o) => o.p)
    expect(result).toBe(0)
  })

  it('should sum string lengths', () => {
    const result = sumBy(['a', 'bb', 'ccc'], (s) => s.length)
    expect(result).toBe(6)
  })

  it('should not mutate the input array', () => {
    const input = [{ p: 1 }, { p: 2 }]
    sumBy(input, (o) => o.p)
    expect(input).toEqual([{ p: 1 }, { p: 2 }])
  })

  it('should pass each item to the iteratee', () => {
    const calls: number[] = []
    sumBy([1, 2, 3], (n) => {
      calls.push(n)
      return n
    })
    expect(calls).toEqual([1, 2, 3])
  })
})

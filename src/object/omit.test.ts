import { describe, expect, it } from 'vitest'
import { omit, omitBy } from './omit'

describe('object > omit', () => {
  it('should work', () => {
    expect(omit({ a: 1, b: 2 }, ['a'])).toEqual({ b: 2 })
    expect(omit({ a: 1, b: 2 }, ['a', 'b', 'c'] as any)).toEqual({})
  })
})

describe('object > omitBy', () => {
  it('should omit properties that satisfy predicate', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omitBy(obj, (v) => v > 1)
    expect(result).toEqual({ a: 1 })
  })

  it('should receive key as second argument', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omitBy(obj, (_v, k) => k === 'b')
    expect(result).toEqual({ a: 1, c: 3 })
  })

  it('should return empty object when all properties match', () => {
    const obj = { a: 1, b: 2 }
    const result = omitBy(obj, (v) => v > 0)
    expect(result).toEqual({})
  })
})

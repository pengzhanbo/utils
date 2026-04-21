import { describe, expect, it } from 'vitest'
import { pick, pickBy } from './pick'

describe('object > pick', () => {
  it('should work', () => {
    expect(pick({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 })
    expect(pick({ a: 1, b: 2 }, ['a', 'b', 'c'] as any)).toEqual({ a: 1, b: 2 })
  })
})

describe('object > pickBy', () => {
  it('should pick properties that satisfy predicate', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = pickBy(obj, (v) => v > 1)
    expect(result).toEqual({ b: 2, c: 3 })
  })

  it('should receive key as second argument', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = pickBy(obj, (_v, k) => k === 'b')
    expect(result).toEqual({ b: 2 })
  })

  it('should return empty object when no properties match', () => {
    const obj = { a: 1, b: 2 }
    const result = pickBy(obj, (v) => v > 10)
    expect(result).toEqual({})
  })
})

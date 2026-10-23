import { describe, expect, it } from 'vitest'
import { pick, pickBy } from './pick.js'

describe('object > pick', () => {
  it('should work', () => {
    expect(pick({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 })
    expect(pick({ a: 1, b: 2 }, ['a', 'b', 'c'] as any)).toEqual({ a: 1, b: 2 })
  })

  it('should drop __proto__ but copy constructor and prototype', () => {
    const source = JSON.parse(
      '{"__proto__":{"polluted":true},"a":1,"constructor":"C","prototype":"P"}',
    )

    const result = pick(source, ['__proto__', 'a', 'constructor', 'prototype'])

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false)
    expect((result as any).polluted).toBeUndefined()
    expect(result.a).toBe(1)

    // `constructor` / `prototype` are ordinary keys, not security-sensitive ones
    expect(Object.getOwnPropertyDescriptor(result, 'constructor')!.value).toBe('C')
    expect(Object.getOwnPropertyDescriptor(result, 'prototype')!.value).toBe('P')
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

  it('should drop __proto__ without prototype pollution', () => {
    const source = JSON.parse('{"__proto__":{"polluted":true},"a":1}')

    const result = pickBy(source, () => true)

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
    expect(result.polluted).toBeUndefined()
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false)
    expect(result.a).toBe(1)
  })
})

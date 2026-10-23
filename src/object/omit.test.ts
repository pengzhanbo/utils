import { describe, expect, it } from 'vitest'
import { omit, omitBy } from './omit.js'

describe('object > omit', () => {
  it('should work', () => {
    expect(omit({ a: 1, b: 2 }, ['a'])).toEqual({ b: 2 })
    expect(omit({ a: 1, b: 2 }, ['a', 'b', 'c'] as any)).toEqual({})
  })

  it('should drop __proto__ but copy constructor and prototype', () => {
    const source = JSON.parse(
      '{"__proto__":{"polluted":true},"a":1,"b":2,"constructor":"C","prototype":"P"}',
    )

    const result = omit(source, ['b'])

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
    expect(result.polluted).toBeUndefined()
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false)
    expect(result.a).toBe(1)
    expect('b' in result).toBe(false)

    // `constructor` / `prototype` are ordinary keys, not security-sensitive ones
    expect(Object.getOwnPropertyDescriptor(result, 'constructor')!.value).toBe('C')
    expect(Object.getOwnPropertyDescriptor(result, 'prototype')!.value).toBe('P')
  })

  it('should copy symbol keys like Object.assign', () => {
    const sym = Symbol('test')
    const source = { a: 1, [sym]: 2 }

    const result = omit(source, ['a'])

    expect(result[sym]).toBe(2)
    expect('a' in result).toBe(false)
  })

  it('should skip non-enumerable properties like Object.assign', () => {
    const source: Record<string, unknown> = { a: 1 }
    Object.defineProperty(source, 'hidden', { value: 2, enumerable: false })

    const result = omit(source, [])

    expect(Object.getOwnPropertyNames(result)).toEqual(['a'])
  })

  it('should skip non-enumerable properties when __proto__ is present', () => {
    const source = JSON.parse('{"__proto__":{"polluted":true},"a":1}')
    Object.defineProperty(source, 'hidden', { value: 2, enumerable: false })

    const result = omit(source, [])

    expect(Object.getOwnPropertyNames(result)).toEqual(['a'])
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

  it('should drop __proto__ without prototype pollution', () => {
    const source = JSON.parse('{"__proto__":{"polluted":true},"a":1}')

    const result = omitBy(source, () => false)

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
    expect(result.polluted).toBeUndefined()
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false)
    expect(result.a).toBe(1)
  })
})

import { describe, expect, it } from 'vitest'
import { mapKeys } from './map-keys.js'

describe('object > map-keys', () => {
  it('should map keys with a transform function', () => {
    expect(mapKeys({ a: 1, b: 2 }, (k) => k.toUpperCase())).toEqual({ A: 1, B: 2 })
  })

  it('should pass the value to the function', () => {
    expect(mapKeys({ a: 1, b: 2 }, (k, v) => k + v)).toEqual({ a1: 1, b2: 2 })
  })

  it('should return an empty object for an empty object', () => {
    expect(mapKeys({}, (k) => k)).toEqual({})
  })

  it('should let later entries win on key collision', () => {
    expect(mapKeys({ a: 1, b: 2 }, () => 'x')).toEqual({ x: 2 })
  })

  it('should not mutate the input object', () => {
    const obj = { a: 1, b: 2 }
    mapKeys(obj, (k) => k.toUpperCase())
    expect(obj).toEqual({ a: 1, b: 2 })
  })

  it('should ignore symbol keys of the source object', () => {
    const sym = Symbol('s')
    const result = mapKeys({ [sym]: 1, a: 2 }, (k) => String(k))
    expect(result).toEqual({ a: 2 })
  })

  it('should map keys to symbols', () => {
    const sym = Symbol('x')
    const result = mapKeys({ a: 1, b: 2 }, () => sym)
    expect(Object.getOwnPropertySymbols(result)).toEqual([sym])
    expect((result as Record<symbol, number>)[sym]).toBe(2)
    expect(Object.keys(result)).toEqual([])
  })

  it('should preserve type of values', () => {
    const result: Record<PropertyKey, number> = mapKeys({ a: 1, b: 2 }, (k) => k.toUpperCase())
    expect(result).toEqual({ A: 1, B: 2 })
  })

  it('should create own __proto__ data property without polluting prototype', () => {
    const result = mapKeys({ a: 1 }, () => '__proto__')
    expect(Object.getOwnPropertyDescriptor(result, '__proto__')?.value).toBeUndefined()
    expect(Object.getOwnPropertyNames(result)).not.toContain('__proto__')
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })
})

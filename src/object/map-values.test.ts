import { describe, expect, it } from 'vitest'
import { mapValues } from './map-values.js'

describe('object > map-values', () => {
  it('should map values with a transform function', () => {
    expect(mapValues({ a: 1, b: 2 }, (v) => v * 2)).toEqual({ a: 2, b: 4 })
  })

  it('should pass the key to the function', () => {
    expect(mapValues({ a: 1, b: 2 }, (v, k) => k + v)).toEqual({ a: 'a1', b: 'b2' })
  })

  it('should return an empty object for an empty object', () => {
    expect(mapValues({}, (v) => v)).toEqual({})
  })

  it('should preserve all keys', () => {
    const result = mapValues({ a: 1, b: 2, c: 3 }, (v) => v * 10)
    expect(result).toEqual({ a: 10, b: 20, c: 30 })
    expect(Object.keys(result).sort()).toEqual(['a', 'b', 'c'])
  })

  it('should not mutate the input object', () => {
    const obj = { a: 1, b: 2 }
    mapValues(obj, (v) => v * 2)
    expect(obj).toEqual({ a: 1, b: 2 })
  })

  it('should ignore symbol keys', () => {
    const sym = Symbol('s')
    const result = mapValues({ [sym]: 1, a: 2 }, (v) => v * 2)
    expect(result).toEqual({ a: 4 })
    expect(Object.getOwnPropertySymbols(result)).toEqual([])
  })

  it('should preserve type of values', () => {
    const result: Record<string, number> = mapValues({ a: 'hello', b: 'world' }, (v) => v.length)
    expect(result).toEqual({ a: 5, b: 5 })
  })

  it('should create own __proto__ data property without polluting prototype', () => {
    const source = JSON.parse('{"__proto__":1}') as Record<string, number>
    const result = mapValues(source, (v) => v * 2)
    expect(Object.getOwnPropertyDescriptor(result, '__proto__')?.value).toBeUndefined()
    expect(Object.getOwnPropertyNames(result)).not.toContain('__proto__')
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })
})

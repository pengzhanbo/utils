import { describe, expect, it } from 'vitest'
import { invert } from './invert.js'

describe('object > invert', () => {
  it('should swap keys and values', () => {
    expect(invert({ a: 1, b: 2 })).toEqual({ 1: 'a', 2: 'b' })
  })

  it('should swap string values', () => {
    expect(invert({ a: 'x', b: 'y' })).toEqual({ x: 'a', y: 'b' })
  })

  it('should return an empty object for an empty object', () => {
    expect(invert({})).toEqual({})
  })

  it('should let later keys win on duplicate values', () => {
    expect(invert({ a: 1, b: 1 })).toEqual({ 1: 'b' })
    expect(invert({ a: 'x', b: 'y', c: 'x' })).toEqual({ x: 'c', y: 'b' })
  })

  it('should not mutate the input object', () => {
    const obj = { a: 1, b: 2 }
    invert(obj)
    expect(obj).toEqual({ a: 1, b: 2 })
  })

  it('should ignore symbol keys of the source object', () => {
    const sym = Symbol('s')
    const result = invert({ [sym]: 1, a: 2 })
    expect(result).toEqual({ 2: 'a' })
  })

  it('should turn symbol values into symbol keys', () => {
    const sym = Symbol('v')
    const result = invert({ a: sym, b: 2 })
    expect(Object.getOwnPropertySymbols(result)).toEqual([sym])
    expect((result as Record<symbol, string>)[sym]).toBe('a')
    expect((result as Record<string, string>)[2]).toBe('b')
  })

  it('should preserve type of result', () => {
    const result: Record<number, string> = invert({ a: 1, b: 2 })
    expect(result).toEqual({ 1: 'a', 2: 'b' })
  })
})

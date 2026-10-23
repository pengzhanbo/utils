import { describe, expect, it } from 'vitest'
import { objectMap } from './map.js'

describe('object > objectMap', () => {
  it('should work', () => {
    expect(objectMap({ a: 1, b: 2 }, (k, v) => [k.toString().toUpperCase(), v.toString()])).toEqual(
      { A: '1', B: '2' },
    )
    expect(objectMap({ a: 1, b: 2 }, (k, v) => [v, k])).toEqual({ 1: 'a', 2: 'b' })
    expect(objectMap({ a: 1, b: 2 }, (k, v) => (k === 'a' ? undefined : [k, v]))).toEqual({ b: 2 })
  })

  it('should drop __proto__ key to prevent prototype pollution', () => {
    const result = objectMap({ a: 1 }, () => ['__proto__' as any, { polluted: true }] as any)
    expect(result).toEqual({})
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false)
    expect(({} as any).polluted).toBeUndefined()
  })

  it('should keep constructor and prototype as ordinary keys', () => {
    const result = objectMap({ a: 1, b: 2 }, (key) =>
      key === 'a' ? ['constructor' as any, 'C'] : ['prototype' as any, 'P'],
    )

    expect(Object.getOwnPropertyDescriptor(result, 'constructor')!.value).toBe('C')
    expect(Object.getOwnPropertyDescriptor(result, 'prototype')!.value).toBe('P')
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
  })
})

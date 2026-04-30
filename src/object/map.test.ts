import { describe, expect, it } from 'vitest'
import { objectMap } from './map'

describe('object > objectMap', () => {
  it('should work', () => {
    expect(objectMap({ a: 1, b: 2 }, (k, v) => [k.toString().toUpperCase(), v.toString()])).toEqual(
      { A: '1', B: '2' },
    )
    expect(objectMap({ a: 1, b: 2 }, (k, v) => [v, k])).toEqual({ 1: 'a', 2: 'b' })
    expect(objectMap({ a: 1, b: 2 }, (k, v) => (k === 'a' ? undefined : [k, v]))).toEqual({ b: 2 })
  })

  it('should filter out __proto__ key to prevent prototype pollution', () => {
    const result = objectMap({ a: 1 }, () => ['__proto__' as any, { polluted: true }] as any)
    expect(result).toEqual({})
    expect(({} as any).polluted).toBeUndefined()
  })

  it('should filter out constructor key to prevent prototype pollution', () => {
    const result = objectMap({ a: 1 }, () => ['constructor' as any, { polluted: true }] as any)
    expect(result).toEqual({})
  })

  it('should filter out prototype key to prevent prototype pollution', () => {
    const result = objectMap({ a: 1 }, () => ['prototype' as any, { polluted: true }] as any)
    expect(result).toEqual({})
  })
})

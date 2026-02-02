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
})

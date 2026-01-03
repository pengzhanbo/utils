import { describe, expect, it } from 'vitest'
import { objectGet } from './get'

describe('object > objectGet', () => {
  it('should work', () => {
    expect(objectGet({ a: 1 }, 'a')).toBe(1)
    expect(objectGet({ a: { b: 2 } }, 'a.b')).toBe(2)
    expect(objectGet({ a: [{ b: 2 }] }, 'a[0].b')).toBe(2)
    expect(objectGet({ a: [{ b: 2 }] }, 'a.0.b')).toBe(2)
  })

  it('should work with unknown paths', () => {
    expect(objectGet({ a: [{ b: 2 }] }, 'a.1.b')).toBe(undefined)
  })
})

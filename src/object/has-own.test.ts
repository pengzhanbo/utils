import { describe, expect, it } from 'vitest'
import { hasOwn } from './has-own'

describe('object > hasOwn', () => {
  it('should be true', () => {
    expect(hasOwn({ a: 1 }, 'a')).toBe(true)
  })

  it('should be false', () => {
    expect(hasOwn(null, 'a')).toBe(false)
    expect(hasOwn({ a: 1 }, 'toString')).toBe(false)
    expect(hasOwn({ a: 1 }, 'length')).toBe(false)
    expect(hasOwn({ a: 1 }, '__proto__')).toBe(false)
  })

  it('should be extends object', () => {
    const obj1 = { a: 1 }
    const obj2 = Object.create(obj1)
    obj2.b = 1

    expect(hasOwn(obj1, 'a')).toBe(true)
    expect(hasOwn(obj2, 'a')).toBe(false)
    expect(hasOwn(obj2, 'b')).toBe(true)
  })
})

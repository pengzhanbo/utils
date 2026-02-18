import { describe, expect, it } from 'vitest'
import { isKeyof } from './is-keyof'

describe('predicate > isKeyof', () => {
  it('should work', () => {
    expect(isKeyof({ a: 1 }, 'a')).toBe(true)
    expect(isKeyof({ a: 1 }, 'b')).toBe(false)
  })

  it('should work with symbol', () => {
    const symbol = Symbol('a')
    expect(isKeyof({ [symbol]: 1 }, symbol)).toBe(true)
  })

  it('should work with extends object', () => {
    const obj1 = { a: 1 }
    const obj2 = Object.create(obj1)
    obj2.b = 1

    expect(isKeyof(obj1, 'a')).toBe(true)
    expect(isKeyof(obj2, 'a')).toBe(true)
  })
})

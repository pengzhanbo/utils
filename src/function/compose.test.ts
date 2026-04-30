import { describe, expect, it } from 'vitest'
import { compose } from './compose'

describe('function > compose', () => {
  function add(a: number, b: number) {
    return a + b
  }

  function multiply(a: number) {
    return a * 2
  }

  function subtract(a: number) {
    return a - 1
  }

  it('should work', () => {
    expect(compose()(1, 2)).toBe(1)
    expect(compose(add)(1, 2)).toBe(3)
    expect(compose(multiply, add)(1, 2)).toBe(6)
    expect(compose(subtract, add)(1, 2)).toBe(2)
    expect(compose(subtract, multiply, add)(1, 2)).toBe(5)
  })

  it('should return first argument for empty composition (identity)', () => {
    expect(compose()('hello')).toBe('hello')
    expect(compose()(42)).toBe(42)
    expect(compose()(null)).toBe(null)
  })
})

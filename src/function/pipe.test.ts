import { describe, expect, it } from 'vitest'
import { pipe } from './pipe'

describe('function > pipe', () => {
  function add(a: number, b: number) {
    return a + b
  }

  function multiply(a: number) {
    return a * 2
  }

  function subtract(a: number) {
    return a - 1
  }

  function toString(a: number) {
    return String(a)
  }

  it('should work with multiple functions', () => {
    // pipe(add, multiply)(1, 2) = multiply(add(1, 2)) = multiply(3) = 6
    expect(pipe(add, multiply)(1, 2)).toBe(6)
    // pipe(add, multiply, subtract)(1, 2) = subtract(multiply(add(1, 2))) = subtract(6) = 5
    expect(pipe(add, multiply, subtract)(1, 2)).toBe(5)
    // pipe(multiply, subtract, add)(5, 1) — wrong: multiply(5, 1) only uses first arg
    // Actually: pipe(multiply, subtract)(5) = subtract(multiply(5)) = subtract(10) = 9
    expect(pipe(multiply, subtract)(5)).toBe(9)
  })

  it('should work with a single function', () => {
    expect(pipe(add)(1, 2)).toBe(3)
    expect(pipe(multiply)(5)).toBe(10)
    expect(pipe(subtract)(3)).toBe(2)
  })

  it('should return first argument for empty pipe (identity)', () => {
    expect(pipe()('hello')).toBe('hello')
    expect(pipe()(42)).toBe(42)
    expect(pipe()(null)).toBe(null)
    expect(pipe()(undefined)).toBe(undefined)
    expect(pipe()({ a: 1 })).toEqual({ a: 1 })
  })

  it('should compose in the correct order (left to right)', () => {
    // pipe(a, b)(x) = b(a(x))
    const prepend = (s: string) => `pre-${s}`
    const append = (s: string) => `${s}-post`
    expect(pipe(prepend, append)('hello')).toBe('pre-hello-post')
  })

  it('should handle type changes through the pipeline', () => {
    // number → string → length in string form
    const result = pipe(add, toString)(3, 4)
    expect(result).toBe('7')
  })

  it('should not mutate arguments', () => {
    const arr = [1, 2, 3]
    const first = (a: number[]) => a[0]
    const double = (n: number) => n * 2
    expect(pipe(first, double)(arr)).toBe(2)
    expect(arr).toEqual([1, 2, 3])
  })

  it('should handle functions with different arities', () => {
    function sum(a: number, b: number, c: number) {
      return a + b + c
    }
    function isPositive(n: number) {
      return n > 0
    }
    expect(pipe(sum, isPositive)(1, 2, 3)).toBe(true)
    expect(pipe(sum, isPositive)(-1, -2, -3)).toBe(false)
  })

  it('should propagate errors from the first function', () => {
    const throwFn = () => {
      throw new Error('first error')
    }
    const neverCalled = () => 'called'
    expect(() => pipe(throwFn, neverCalled)()).toThrow('first error')
  })

  it('should propagate errors from intermediate functions', () => {
    const identity = <T>(x: T) => x
    const throwFn = () => {
      throw new Error('mid error')
    }
    expect(() => pipe(identity, throwFn, identity)('x')).toThrow('mid error')
  })

  it('should handle string transformations', () => {
    const trim = (s: string) => s.trim()
    const upper = (s: string) => s.toUpperCase()
    const exclaim = (s: string) => `${s}!`
    expect(pipe(trim, upper, exclaim)('  hello ')).toBe('HELLO!')
  })

  it('should preserve `this` context', () => {
    const obj = {
      prefix: '> ',
      wrap(this: { prefix: string }, s: string) {
        return `${this.prefix}${s}`
      },
    }
    const exclaim = (s: string) => `${s}!`
    const piped = pipe(obj.wrap, exclaim)
    expect(piped.call(obj, 'hello')).toBe('> hello!')
  })
})

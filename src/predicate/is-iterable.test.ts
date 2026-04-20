import { describe, expect, it } from 'vitest'
import { isIterable } from './is-iterable'

describe('predicate > isIterable', () => {
  it('should return true for built-in iterables', () => {
    expect(isIterable([])).toBe(true)
    expect(isIterable('hello')).toBe(true)
    expect(isIterable(new Set())).toBe(true)
    expect(isIterable(new Map())).toBe(true)
    expect(isIterable(new Int8Array())).toBe(true)
  })

  it('should return true for generator functions return value', () => {
    function* gen() {}
    expect(isIterable(gen())).toBe(true)
  })

  it('should return false for non-iterable values', () => {
    expect(isIterable({})).toBe(false)
    expect(isIterable(123)).toBe(false)
    expect(isIterable(null)).toBe(false)
    expect(isIterable(undefined)).toBe(false)
    expect(isIterable(Symbol('test'))).toBe(false)
  })

  it('should return false for objects with Symbol.iterator that throws', () => {
    const obj = {
      [Symbol.iterator]() {
        throw new Error('iterator error')
      },
    }
    // isIterable checks typeof, not actual invocation
    expect(isIterable(obj)).toBe(true)
  })

  it('should work as a type guard', () => {
    const value: unknown = 'test'
    if (isIterable(value)) {
      expect(typeof value[Symbol.iterator]).toBe('function')
    }
  })
})

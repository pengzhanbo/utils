import { describe, expect, it } from 'vitest'
import { isPromise, isPromiseLike } from './is-promise'

describe('predicate > isPromise', () => {
  it('should return true for Promise instances', () => {
    expect(isPromise(Promise.resolve())).toBe(true)
    expect(isPromise(new Promise(() => {}))).toBe(true)
  })

  it('should return false for non-Promise values', () => {
    expect(isPromise({ then: () => {} })).toBe(false)
    expect(isPromise({ catch: () => {} })).toBe(false)
    expect(isPromise({})).toBe(false)
    expect(isPromise([])).toBe(false)
    expect(isPromise(null)).toBe(false)
    expect(isPromise(undefined)).toBe(false)
    expect(isPromise('promise')).toBe(false)
    expect(isPromise(123)).toBe(false)
  })

  it('should work as a type guard', () => {
    const value: unknown = Promise.resolve(42)
    if (isPromise(value)) {
      expect(value).toBeInstanceOf(Promise)
    }
  })
})

describe('predicate > isPromiseLike', () => {
  it('should return true for Promise instances', () => {
    expect(isPromiseLike(Promise.resolve())).toBe(true)
    expect(isPromiseLike(new Promise(() => {}))).toBe(true)
  })

  it('should return true for thenable objects', () => {
    expect(isPromiseLike({ then: () => {} })).toBe(true)
    expect(isPromiseLike({ then: (resolve: any) => resolve(1) })).toBe(true)
    expect(isPromiseLike({ then: () => {}, catch: () => {} })).toBe(true)
  })

  it('should return false for non-thenable values', () => {
    expect(isPromiseLike({})).toBe(false)
    expect(isPromiseLike([])).toBe(false)
    expect(isPromiseLike({ catch: () => {} })).toBe(false)
    expect(isPromiseLike({ then: 123 })).toBe(false)
    expect(isPromiseLike({ then: 'not a function' })).toBe(false)
    expect(isPromiseLike(null)).toBe(false)
    expect(isPromiseLike(undefined)).toBe(false)
    expect(isPromiseLike('promise')).toBe(false)
    expect(isPromiseLike(123)).toBe(false)
    expect(isPromiseLike(true)).toBe(false)
    expect(isPromiseLike(Symbol('test'))).toBe(false)
  })

  it('should return false for functions without then method', () => {
    expect(isPromiseLike(() => {})).toBe(false)
    expect(isPromiseLike(async () => {})).toBe(false)
  })

  it('should work as a type guard', () => {
    const value: unknown = { then: (resolve: any) => resolve(42) }
    if (isPromiseLike(value)) {
      expect(value.then).toBeTypeOf('function')
    }
  })
})

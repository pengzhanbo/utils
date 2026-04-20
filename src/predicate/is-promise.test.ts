import { describe, expect, it } from 'vitest'
import { isPromise } from './is-promise'

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

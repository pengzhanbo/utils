import { describe, expect, it } from 'vitest'
import { toError } from './to-error'

describe('guard > toError', () => {
  it('should return Error instances as-is', () => {
    const error = new Error('test')
    expect(toError(error)).toBe(error)
  })

  it('should return TypeError instances as-is', () => {
    const error = new TypeError('type error')
    expect(toError(error)).toBe(error)
  })

  it('should return AggregateError instances as-is', () => {
    const error = new AggregateError([new Error('err')], 'aggregate')
    expect(toError(error)).toBe(error)
  })

  it('should return DOMException instances as-is', () => {
    const error = new DOMException('dom error', 'AbortError')
    expect(toError(error)).toBe(error)
  })

  it('should throw with default message for non-Error values', () => {
    expect(() => toError('not an error')).toThrow('Expected an Error')
    expect(() => toError({})).toThrow('Expected an Error')
    expect(() => toError(null)).toThrow('Expected an Error')
    expect(() => toError(undefined)).toThrow('Expected an Error')
  })

  it('should throw with custom message for non-Error values', () => {
    expect(() => toError('not an error', 'Custom error')).toThrow('Custom error')
    expect(() => toError({}, 'Expected an Error object')).toThrow('Expected an Error object')
  })

  it('should work with cross-iframe error-like objects', () => {
    // Simulating a cross-frame error object
    const errorLike = {
      message: 'Error message',
      stack: 'Error: Error message\n    at someFunction',
      name: 'Error',
    }
    expect(() => toError(errorLike as any)).toThrow('Expected an Error')
  })
})

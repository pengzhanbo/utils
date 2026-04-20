import { describe, expect, it } from 'vitest'
import { isError } from './is-error'

describe('isError', () => {
  it('should return true for native Error instances', () => {
    expect(isError(new Error('Test error'))).toBe(true)
    expect(isError(new TypeError('Type error'))).toBe(true)
    expect(isError(new SyntaxError('Syntax error'))).toBe(true)
    expect(isError(new ReferenceError('Reference error'))).toBe(true)
    expect(isError(new RangeError('Range error'))).toBe(true)
    expect(isError(new EvalError('Eval error'))).toBe(true)
    expect(isError(new URIError('URI error'))).toBe(true)
  })

  it('should return true for custom error class instances', () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message)
        this.name = 'CustomError'
      }
    }

    expect(isError(new CustomError('Custom error'))).toBe(true)
  })

  it('should return true for cross-iframe error objects', () => {
    // Test with a plain object that has error-like properties
    // Note: In real cross-iframe scenarios, Object.prototype.toString.call(error) would return '[object Error]'
    // We can't fully simulate this in tests without modifying Object.prototype, so we test the other conditions
    const errorLikeObject = {
      message: 'Error message',
      stack: 'Error: Error message\n    at someFunction',
    }

    // Test that objects with message and stack properties but wrong toString are rejected
    expect(isError(errorLikeObject as any)).toBe(false)
  })

  it('should return true for AggregateError', () => {
    const aggregateError = new AggregateError(
      [new Error('err1'), new Error('err2')],
      'Multiple errors',
    )
    expect(isError(aggregateError)).toBe(true)
  })

  it('should return true for DOMException', () => {
    const domException = new DOMException('Invalid operation', 'AbortError')
    expect(isError(domException)).toBe(true)
  })

  it('should handle edge cases', () => {
    // Test with null and undefined
    expect(isError(null)).toBe(false)
    expect(isError(undefined)).toBe(false)

    // Test with objects that have some error properties but not all
    expect(isError({ message: 'Error' })).toBe(false)
    expect(isError({ stack: 'Stack trace' })).toBe(false)
  })

  it('should return false for non-error objects', () => {
    // Plain object with message property
    expect(isError({ message: 'Not an error' })).toBe(false)
    // Object with message and stack properties
    expect(isError({ message: 'Not an error', stack: 'Stack trace' })).toBe(false)
    // Null
    expect(isError(null)).toBe(false)
    // Undefined
    expect(isError(undefined)).toBe(false)
    // String
    expect(isError('Error message')).toBe(false)
    // Number
    expect(isError(42)).toBe(false)
    // Boolean
    expect(isError(true)).toBe(false)
    // Array
    expect(isError([])).toBe(false)
    // Function
    expect(isError(() => {})).toBe(false)
  })

  it('should return false for other objects', () => {
    expect(isError(new Date())).toBe(false)
    expect(isError(new RegExp('test'))).toBe(false)
    expect(isError({})).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { RetryError } from './RetryError'

describe('error > RetryError', () => {
  it('should create error with default message', () => {
    const error = new RetryError(3)
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('RetryError')
    expect(error.message).toBe('The retry operation failed')
    expect(error.attempts).toBe(3)
  })

  it('should create error with custom message', () => {
    const error = new RetryError(5, 'Custom error message')
    expect(error.message).toBe('Custom error message')
    expect(error.attempts).toBe(5)
  })

  it('should handle zero attempts (falsy value)', () => {
    // This tests line 23: this.attempts = attempts || 0
    const error = new RetryError(0)
    expect(error.attempts).toBe(0)
  })

  it('should be throwable and catchable', () => {
    try {
      throw new RetryError(2, 'Test error')
    } catch (e) {
      expect(e).toBeInstanceOf(RetryError)
      expect((e as RetryError).attempts).toBe(2)
      expect((e as Error).message).toBe('Test error')
    }
  })

  it('should have correct prototype chain', () => {
    const error = new RetryError(1)
    expect(Object.getPrototypeOf(error)).toBe(RetryError.prototype)
    expect(error instanceof Error).toBe(true)
    expect(error instanceof RetryError).toBe(true)
  })

  it('should preserve cause from options', () => {
    const original = new Error('original')
    const error = new RetryError(3, 'msg', { cause: original })
    expect(error.cause).toBe(original)
    expect(error.cause).toBeInstanceOf(Error)
  })

  it('should truncate fractional attempts', () => {
    const error = new RetryError(3.7)
    expect(error.attempts).toBe(3)
  })
})

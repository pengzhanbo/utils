import { describe, expect, it } from 'vitest'
import { TimeoutError } from './TimeoutError'

describe('error > TimeoutError', () => {
  it('should create TimeoutError with default message', () => {
    const error = new TimeoutError()
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('TimeoutError')
    expect(error.message).toBe('The operation was timed out')
  })

  it('should create TimeoutError with custom message', () => {
    const error = new TimeoutError('Request timeout')
    expect(error.message).toBe('Request timeout')
    expect(error.name).toBe('TimeoutError')
  })

  it('should create TimeoutError with empty string message', () => {
    const error = new TimeoutError('')
    expect(error.message).toBe('')
    expect(error.name).toBe('TimeoutError')
  })

  it('should be catchable', () => {
    try {
      throw new TimeoutError('test')
    } catch (e) {
      expect(e).toBeInstanceOf(TimeoutError)
      expect((e as TimeoutError).message).toBe('test')
    }
  })

  it('should have proper stack trace', () => {
    const error = new TimeoutError('test')
    expect(error.stack).toBeDefined()
  })

  it('should work with different message types', () => {
    expect(new TimeoutError('Custom message').message).toBe('Custom message')
    expect(new TimeoutError('Timeout after 5000ms').message).toBe('Timeout after 5000ms')
  })

  it('should extend Error class', () => {
    const error = new TimeoutError()
    expect(error).toBeInstanceOf(Error)
  })
})

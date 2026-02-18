import { describe, expect, it } from 'vitest'
import { AbortError } from './AbortError'

describe('error > AbortError', () => {
  it('should create AbortError with default message', () => {
    const error = new AbortError()
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('AbortError')
    expect(error.message).toBe('The operation was aborted')
  })

  it('should create AbortError with custom message', () => {
    const error = new AbortError('Operation cancelled')
    expect(error.message).toBe('Operation cancelled')
    expect(error.name).toBe('AbortError')
  })

  it('should create AbortError with empty string message', () => {
    const error = new AbortError('')
    expect(error.message).toBe('')
    expect(error.name).toBe('AbortError')
  })

  it('should be catchable', () => {
    try {
      throw new AbortError('test')
    } catch (e) {
      expect(e).toBeInstanceOf(AbortError)
      expect((e as AbortError).message).toBe('test')
    }
  })

  it('should have proper stack trace', () => {
    const error = new AbortError('test')
    expect(error.stack).toBeDefined()
  })

  it('should work with different message types', () => {
    expect(new AbortError('Custom message').message).toBe('Custom message')
    expect(new AbortError('Error: failed').message).toBe('Error: failed')
  })
})

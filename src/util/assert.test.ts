import { describe, expect, it } from 'vitest'
import { assert } from './assert'

describe('util > assert', () => {
  it('should throw error when condition is false', () => {
    expect(() => assert(false)).toThrow()
  })

  it('should not throw error when condition is true', () => {
    expect(() => assert(true)).not.toThrow()
  })

  it('should throw with custom error message', () => {
    expect(() => assert(false, 'custom message')).toThrow('custom message')
  })

  it('should throw with default message when condition is false and no message provided', () => {
    expect(() => assert(false)).toThrow('Assertion failed')
  })

  it('should throw for falsy values', () => {
    expect(() => assert(0 as unknown as boolean)).toThrow()
    expect(() => assert('' as unknown as boolean)).toThrow()
    expect(() => assert(null as unknown as boolean)).toThrow()
    expect(() => assert(undefined as unknown as boolean)).toThrow()
  })

  it('should not throw for truthy values', () => {
    expect(() => assert(1 as unknown as boolean)).not.toThrow()
    expect(() => assert('truthy' as unknown as boolean)).not.toThrow()
    expect(() => assert({} as unknown as boolean)).not.toThrow()
    expect(() => assert([] as unknown as boolean)).not.toThrow()
  })

  it('should narrow type in if block', () => {
    const value: string | boolean = 'hello'
    if (value) {
      assert(typeof value === 'string')
      expect(typeof value).toBe('string')
    }
  })

  it('should handle multiple assertions', () => {
    const a = 1,
      b = 2
    assert(a > 0)
    assert(b > 0)
    expect(a + b).toBe(3)
  })
})

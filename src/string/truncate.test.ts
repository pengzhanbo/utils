import { describe, expect, it } from 'vitest'
import { truncate } from './truncate'

describe('string > truncate', () => {
  it('should return original string if shorter than length', () => {
    expect(truncate('hi', 10)).toBe('hi')
    expect(truncate('hello', 5)).toBe('hello')
  })

  it('should truncate string longer than length', () => {
    expect(truncate('hello world', 8)).toBe('hello...')
    expect(truncate('hello world', 5)).toBe('he...')
  })

  it('should truncate string with custom omission', () => {
    expect(truncate('hello world', 8, '~~')).toBe('hello ~~')
    expect(truncate('hello world', 5, '~~')).toBe('hel~~')
    expect(truncate('hello world', 6, '..')).toBe('hell..')
  })

  it('should return omission if length is less than or equal to omission length', () => {
    expect(truncate('hello', 3, '...')).toBe('...')
    expect(truncate('hello', 0, '...')).toBe('')
  })

  it('should handle empty string', () => {
    expect(truncate('', 5)).toBe('')
  })

  it('should handle length of 0', () => {
    expect(truncate('hello', 0)).toBe('')
    expect(truncate('hello', 0, '..')).toBe('')
  })
})

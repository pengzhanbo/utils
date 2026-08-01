import { describe, expect, it } from 'vitest'
import { mask } from './mask'

describe('string > mask', () => {
  it('should mask middle of phone number by default', () => {
    expect(mask('13800138000')).toBe('138****8000')
  })

  it('should mask with explicit start and end', () => {
    expect(mask('user@example.com', { start: 1, end: 4 })).toBe('u***@example.com')
  })

  it('should count negative end from the end of the string', () => {
    expect(mask('12345678', { start: 2, end: -2 })).toBe('12****78')
  })

  it('should clamp negative start to 0', () => {
    expect(mask('1234567890', { start: -5, end: 7 })).toBe('*******890')
  })

  it('should clamp end greater than length to length', () => {
    expect(mask('12345678', { start: 2, end: 100 })).toBe('12******')
  })

  it('should return value unchanged when start >= end', () => {
    expect(mask('12345678', { start: 5, end: 3 })).toBe('12345678')
    expect(mask('12345678', { start: 3, end: 3 })).toBe('12345678')
  })

  it('should return value unchanged when start >= length', () => {
    expect(mask('1234', { start: 10 })).toBe('1234')
    expect(mask('1234', { start: 4, end: 0 })).toBe('1234')
  })

  it('should handle empty string', () => {
    expect(mask('')).toBe('')
    expect(mask('', { start: 0, end: 0 })).toBe('')
  })

  it('should mask with custom single maskChar', () => {
    expect(mask('12345678', { start: 2, end: 6, maskChar: '#' })).toBe('12####78')
  })

  it('should mask with multi-char maskChar', () => {
    expect(mask('1234567890', { start: 2, end: 8, maskChar: 'ab' })).toBe('12abababababab90')
  })

  it('should return value unchanged when end from end exceeds string length', () => {
    expect(mask('123', { end: -4 })).toBe('123')
  })

  it('should mask from the beginning when start is 0', () => {
    expect(mask('1234567890', { start: 0, end: 4 })).toBe('****567890')
  })

  it('should resolve NaN and Infinity in options', () => {
    expect(mask('1234567890', { start: Number.NaN, end: 5 })).toBe('*****67890')
    expect(mask('1234567890', { start: 2, end: Number.POSITIVE_INFINITY })).toBe('12********')
    expect(mask('1234567890', { start: Number.POSITIVE_INFINITY })).toBe('******7890')
    expect(mask('1234567890', { start: 2, end: Number.NEGATIVE_INFINITY })).toBe('12********')
  })

  it('should not mutate the input string', () => {
    const input = '13800138000'
    mask(input)
    expect(input).toBe('13800138000')
    mask(input, { start: 1, end: -1, maskChar: '#' })
    expect(input).toBe('13800138000')
  })
})

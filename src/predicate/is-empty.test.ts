import { describe, expect, it } from 'vitest'
import { isEmpty } from './is-empty'

describe('predicate > isEmpty', () => {
  it('should return true for null', () => {
    expect(isEmpty(null)).toBe(true)
  })

  it('should return true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true)
  })

  it('should return true for empty strings', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('')).toBe(true)
  })

  it('should return false for non-empty strings', () => {
    expect(isEmpty('hello')).toBe(false)
    expect(isEmpty(' ')).toBe(false)
  })

  it('should return true for empty arrays', () => {
    expect(isEmpty([])).toBe(true)
  })

  it('should return false for non-empty arrays', () => {
    expect(isEmpty([1, 2, 3])).toBe(false)
    expect(isEmpty([null])).toBe(false)
  })

  it('should return true for empty objects', () => {
    expect(isEmpty({})).toBe(true)
  })

  it('should return false for non-empty objects', () => {
    expect(isEmpty({ a: 1 })).toBe(false)
    expect(isEmpty({ length: 0 })).toBe(false)
  })

  it('should return true for empty Map', () => {
    expect(isEmpty(new Map())).toBe(true)
  })

  it('should return false for non-empty Map', () => {
    expect(isEmpty(new Map([['a', 1]]))).toBe(false)
  })

  it('should return true for empty Set', () => {
    expect(isEmpty(new Set())).toBe(true)
  })

  it('should return false for non-empty Set', () => {
    expect(isEmpty(new Set([1]))).toBe(false)
  })

  it('should return false for other types', () => {
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(false)).toBe(false)
    expect(isEmpty(Symbol('test'))).toBe(false)
    expect(isEmpty(123)).toBe(false)
  })
})

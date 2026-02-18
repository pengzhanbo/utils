import { describe, expect, it } from 'vitest'
import { isString } from './is-string'

describe('predicate > isString', () => {
  it('should work', () => {
    expect(isString(undefined)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(1)).toBe(false)
    expect(isString('')).toBe(true)
    expect(isString('1')).toBe(true)
    expect(isString(true)).toBe(false)
    expect(isString(false)).toBe(false)
    expect(isString({})).toBe(false)
    expect(isString(() => {})).toBe(false)
  })
})

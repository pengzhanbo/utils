import { describe, expect, it } from 'vitest'
import { isRegexp } from './is-regexp'

describe('predicate > isRegexp', () => {
  it('should work', () => {
    expect(isRegexp(undefined)).toBe(false)
    expect(isRegexp(null)).toBe(false)
    expect(isRegexp(1)).toBe(false)
    expect(isRegexp('1')).toBe(false)
    expect(isRegexp(true)).toBe(false)
    expect(isRegexp(false)).toBe(false)
    expect(isRegexp({})).toBe(false)
    expect(isRegexp(() => {})).toBe(false)
    expect(isRegexp(/a/)).toBe(true)
    expect(isRegexp(new RegExp('a'))).toBe(true)
  })
})

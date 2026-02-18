import { describe, expect, it } from 'vitest'
import { isFunction } from './is-function'

describe('predicate > isFunction', () => {
  it('should work', () => {
    expect(isFunction(undefined)).toBe(false)
    expect(isFunction(null)).toBe(false)
    expect(isFunction(1)).toBe(false)
    expect(isFunction('1')).toBe(false)
    expect(isFunction(true)).toBe(false)
    expect(isFunction(false)).toBe(false)
    expect(isFunction({})).toBe(false)
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(function () {})).toBe(true)
  })
})

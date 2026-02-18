import { describe, expect, it } from 'vitest'
import { isBoolean } from './is-boolean'

describe('predicate > isBoolean', () => {
  it('should work', () => {
    expect(isBoolean(undefined)).toBe(false)
    expect(isBoolean(null)).toBe(false)
    expect(isBoolean(1)).toBe(false)
    expect(isBoolean('1')).toBe(false)
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
    expect(isBoolean({})).toBe(false)
    expect(isBoolean(() => {})).toBe(false)
  })
})

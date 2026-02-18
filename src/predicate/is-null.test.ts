import { describe, expect, it } from 'vitest'
import { isNull } from './is-null'

describe('predicate > isNull', () => {
  it('should work', () => {
    expect(isNull(undefined)).toBe(false)
    expect(isNull(null)).toBe(true)
    expect(isNull(1)).toBe(false)
    expect(isNull('1')).toBe(false)
    expect(isNull(true)).toBe(false)
    expect(isNull(false)).toBe(false)
    expect(isNull({})).toBe(false)
    expect(isNull(() => {})).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { isDef } from './is-def'

describe('predicate > isDef', () => {
  it('should work', () => {
    expect(isDef(undefined)).toBe(false)
    expect(isDef(null)).toBe(true)
    expect(isDef(1)).toBe(true)
    expect(isDef('1')).toBe(true)
    expect(isDef(true)).toBe(true)
    expect(isDef({})).toBe(true)
    expect(isDef(() => {})).toBe(true)
  })
})

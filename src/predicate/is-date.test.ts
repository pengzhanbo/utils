import { describe, expect, it } from 'vitest'
import { isDate } from './is-date'

describe('predicate > isDate', () => {
  it('should work', () => {
    expect(isDate(undefined)).toBe(false)
    expect(isDate(null)).toBe(false)
    expect(isDate(1)).toBe(false)
    expect(isDate('1')).toBe(false)
    expect(isDate(true)).toBe(false)
    expect(isDate(false)).toBe(false)
    expect(isDate({})).toBe(false)
    expect(isDate(() => {})).toBe(false)
    expect(isDate(new Date())).toBe(true)
  })
})

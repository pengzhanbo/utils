import { describe, expect, it } from 'vitest'
import { isUndefined } from './is-undefined'

describe('predicate > isUndefined', () => {
  it('should work', () => {
    expect(isUndefined(undefined)).toBe(true)
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined(1)).toBe(false)
    expect(isUndefined('1')).toBe(false)
    expect(isUndefined(true)).toBe(false)
    expect(isUndefined(false)).toBe(false)
    expect(isUndefined({})).toBe(false)
    expect(isUndefined(() => {})).toBe(false)
  })
})

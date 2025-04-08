import { describe, expect, it } from 'vitest'
import { isTruthy, notNullish, notUndefined } from './guard'

describe('functions > isTruthy', () => {
  it('should work', () => {
    expect(isTruthy(1)).toBe(true)
    expect(isTruthy(0)).toBe(false)
  })

  it('should work with filter', () => {
    expect([1, 2, 3, '', false, undefined].filter(isTruthy)).toEqual([1, 2, 3])
  })
})

describe('notUndefined', () => {
  it('should work', () => {
    expect(notUndefined(null)).toBe(true)
    expect(notUndefined('')).toBe(true)
    expect(notUndefined(1)).toBe(true)
    expect(notUndefined(true)).toBe(true)
    expect(notUndefined([])).toBe(true)
    expect(notUndefined({})).toBe(true)
    expect(notUndefined(undefined)).toBe(false)
  })

  it('should work with filter', () => {
    expect([1, 2, 3, '', false, undefined].filter(notUndefined)).toEqual([1, 2, 3, '', false])
  })
})

describe('notNullish', () => {
  it('should work', () => {
    expect(notNullish(null)).toBe(false)
    expect(notNullish('')).toBe(true)
    expect(notNullish(1)).toBe(true)
    expect(notNullish(true)).toBe(true)
    expect(notNullish([])).toBe(true)
    expect(notNullish({})).toBe(true)
    expect(notNullish(undefined)).toBe(false)
  })

  it('should work with filter', () => {
    expect([1, 2, 3, '', false, undefined].filter(notNullish)).toEqual([1, 2, 3, '', false])
  })
})

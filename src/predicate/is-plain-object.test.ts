import { describe, expect, it } from 'vitest'
import { isPlainObject } from './is-plain-object'

describe('predicate > isPlainObject', () => {
  it('should work', () => {
    expect(isPlainObject(undefined)).toBe(false)
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject(1)).toBe(false)
    expect(isPlainObject('1')).toBe(false)
    expect(isPlainObject(true)).toBe(false)
    expect(isPlainObject(false)).toBe(false)
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject(() => {})).toBe(false)
    expect(isPlainObject(Object.create(null))).toBe(true)
    expect(isPlainObject(Object.create({}))).toBe(true)
  })
})

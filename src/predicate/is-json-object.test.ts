import { describe, expect, it } from 'vitest'
import { isJSONObject } from './is-json-object'

describe('predicate > isJSONObject', () => {
  it('should work', () => {
    expect(isJSONObject({})).toBe(true)
    expect(isJSONObject({ a: 1 })).toBe(true)
    expect(isJSONObject({ a: () => {}, [Symbol.iterator]: () => [] })).toBe(false)
  })
})

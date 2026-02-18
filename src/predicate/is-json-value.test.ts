import { describe, expect, it } from 'vitest'
import { isJSONValue } from './is-json-value'

describe('predicate > isJSONValue', () => {
  it('should work', () => {
    expect(isJSONValue(undefined)).toBe(false)
    expect(isJSONValue(null)).toBe(true)
    expect(isJSONValue(1)).toBe(true)
    expect(isJSONValue('1')).toBe(true)
    expect(isJSONValue(true)).toBe(true)
    expect(isJSONValue(false)).toBe(true)
    expect(isJSONValue({})).toBe(true)
    expect(isJSONValue(() => {})).toBe(false)
    expect(isJSONValue([])).toBe(true)
    expect(isJSONValue(new Date())).toBe(false)
  })
})

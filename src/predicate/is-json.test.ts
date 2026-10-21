import { describe, expect, it } from 'vitest'
import { isJSONArray, isJSONObject, isJSONValue } from './is-json.js'

describe('predicate > isJSONArray', () => {
  it('should work', () => {
    expect(isJSONArray([])).toBe(true)
    expect(isJSONArray([1, 2, 3])).toBe(true)
    expect(isJSONArray(['1', '2', '3'])).toBe(true)
    expect(isJSONArray([true, false, true])).toBe(true)
    expect(isJSONArray([{}, {}, {}])).toBe(true)
    expect(isJSONArray([() => {}, () => {}, () => {}])).toBe(false)
    expect(isJSONArray([{}, { a: 1 }, {}])).toBe(true)
    expect(isJSONArray([{}, { a: 1 }, { a: () => {}, [Symbol.iterator]: () => [] }])).toBe(false)
  })
})

describe('predicate > isJSONObject', () => {
  it('should work', () => {
    expect(isJSONObject({})).toBe(true)
    expect(isJSONObject({ a: 1 })).toBe(true)
    expect(isJSONObject({ a: () => {}, [Symbol.iterator]: () => [] })).toBe(false)
  })
})

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

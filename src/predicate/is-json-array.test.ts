import { describe, expect, it } from 'vitest'
import { isJSONArray } from './is-json-array'

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

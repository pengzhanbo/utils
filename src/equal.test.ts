import { describe, expect, it } from 'vitest'
import { deepEqual } from './equal'

describe('deepEqual', () => {
  it('should work', () => {
    expect(deepEqual(1, 1)).toBe(true)
    expect(deepEqual(undefined, undefined)).toBe(true)
    expect(deepEqual(null, null)).toBe(true)
    expect(deepEqual(false, false)).toBe(true)
    expect(deepEqual('', '')).toBe(true)
    expect(deepEqual([1, 2], [1, 2])).toBe(true)
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true)
    expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true)
    expect(deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 2] } })).toBe(true)
  })

  it('should not work', () => {
    expect(deepEqual(1, 2)).toBe(false)
    expect(deepEqual(undefined, null)).toBe(false)
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
    expect(deepEqual({ a: 1 }, { a: 1, b: 1 })).toBe(false)
  })
})

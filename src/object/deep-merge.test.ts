import { describe, expect, it } from 'vitest'
import { deepMerge, deepMergeWithArray } from './deep-merge'

describe('object > deepMerge', () => {
  it('should work', () => {
    expect(deepMerge({ a: 1 }, undefined as any)).toEqual({ a: 1 })
    expect(deepMerge({ a: 1 }, { b: 2 }, [])).toEqual({ a: 1, b: 2 })
    expect(deepMerge({ a: 1 }, { constructor: { b: 2 } })).toEqual({ a: 1 })
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
    expect(deepMerge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should work with nested object', () => {
    expect(deepMerge({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } })
    expect(deepMerge({ a: { b: 1 } }, { a: { c: 2 }, d: { e: 3 } })).toEqual({ a: { b: 1, c: 2 }, d: { e: 3 } })
  })

  it('should work with overwrite array', () => {
    expect(deepMerge({ a: [1] }, { a: [2] })).toEqual({ a: [2] })
  })
})

describe('object > deepMergeWithArray', () => {
  it('should work', () => {
    expect(deepMergeWithArray({ a: 1 }, undefined as any)).toEqual({ a: 1 })
    expect(deepMergeWithArray({ a: 1 }, { b: 2 }, [])).toEqual({ a: 1, b: 2 })
    expect(deepMergeWithArray({ a: 1 }, { constructor: { b: 2 } })).toEqual({ a: 1 })
    expect(deepMergeWithArray({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
    expect(deepMergeWithArray({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should work with nested object', () => {
    expect(deepMergeWithArray({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } })
    expect(deepMergeWithArray({ a: { b: 1 } }, { a: { c: 2 }, d: { e: 3 } })).toEqual({ a: { b: 1, c: 2 }, d: { e: 3 } })
  })

  it('should work with array', () => {
    expect(deepMergeWithArray({ a: [1] }, { a: [2] })).toEqual({ a: [1, 2] })
    expect(deepMergeWithArray({ a: [1] }, { a: [2], d: [3] })).toEqual({ a: [1, 2], d: [3] })
  })
})

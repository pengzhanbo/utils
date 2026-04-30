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
    expect(deepMerge({ a: { b: 1 } }, { a: { c: 2 }, d: { e: 3 } })).toEqual({
      a: { b: 1, c: 2 },
      d: { e: 3 },
    })
  })

  it('should work with overwrite array', () => {
    expect(deepMerge({ a: [1] }, { a: [2] })).toEqual({ a: [2] })
  })

  it('should skip non-mergable source', () => {
    expect(deepMerge({ a: 1 }, null as any)).toEqual({ a: 1 })
    expect(deepMerge({ a: 1 }, 42 as any)).toEqual({ a: 1 })
    expect(deepMerge({ a: 1 }, 'string' as any)).toEqual({ a: 1 })
    expect(deepMerge({ a: 1 }, [1, 2] as any)).toEqual({ a: 1 })
  })

  it('should skip when target is not mergable', () => {
    expect(deepMerge(null as any, { b: 2 })).toEqual(null)
    expect(deepMerge(42 as any, { b: 2 })).toEqual(42)
  })

  it('should skip __proto__, constructor, and prototype keys', () => {
    expect(deepMerge({ a: 1 }, { __proto__: { b: 2 } } as any)).toEqual({ a: 1 })
    expect(deepMerge({ a: 1 }, { constructor: { b: 2 } })).toEqual({ a: 1 })
    expect(deepMerge({ a: 1 }, { prototype: { b: 2 } } as any)).toEqual({ a: 1 })
  })

  it('should merge deeply nested objects', () => {
    expect(deepMerge({ a: { b: { c: { d: 1 } } } }, { a: { b: { c: { e: 2 } } } })).toEqual({
      a: { b: { c: { d: 1, e: 2 } } },
    })
  })

  it('should overwrite non-object target value with object source', () => {
    expect(deepMerge({ a: 1 }, { a: { b: 2 } })).toEqual({ a: { b: 2 } })
  })

  it('should replace array target value with merged object source (not silent discard)', () => {
    const result = deepMerge({ a: [1, 2, 3] } as any, { a: { b: 1 } })
    expect(result).toEqual({ a: { b: 1 } })
  })

  it('should preserve existing object when both target and source are mergable', () => {
    const result = deepMerge({ a: { x: 1 } }, { a: { y: 2 } })
    expect(result).toEqual({ a: { x: 1, y: 2 } })
  })

  it('should merge multiple sources in order', () => {
    expect(deepMerge({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 })).toEqual({ a: 1, b: 2, c: 3, d: 4 })
  })

  it('should handle later sources overriding earlier ones', () => {
    expect(deepMerge({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 })
  })

  it('should return target when no sources provided', () => {
    const target = { a: 1 }
    expect(deepMerge(target)).toBe(target)
  })

  it('should handle objects with null prototype', () => {
    const source = Object.create(null)
    source.b = 2
    expect(deepMerge({ a: 1 }, source as any)).toEqual({ a: 1, b: 2 })
  })

  it('should handle class instances as non-mergable', () => {
    class MyClass {
      value = 1
    }
    const instance = new MyClass()
    expect(deepMerge({ a: 1 }, instance as any)).toEqual({ a: 1 })
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
    expect(deepMergeWithArray({ a: { b: 1 } }, { a: { c: 2 }, d: { e: 3 } })).toEqual({
      a: { b: 1, c: 2 },
      d: { e: 3 },
    })
  })

  it('should work with array', () => {
    expect(deepMergeWithArray({ a: [1] }, { a: [2] })).toEqual({ a: [1, 2] })
    expect(deepMergeWithArray({ a: [1] }, { a: [2], d: [3] })).toEqual({ a: [1, 2], d: [3] })
  })

  it('should merge arrays when target and source are both arrays', () => {
    expect(deepMergeWithArray([1, 2] as any, [3, 4] as any)).toEqual([1, 2, 3, 4])
  })

  it('should replace truthy non-array target with source array', () => {
    expect(deepMergeWithArray({ a: 1 }, { a: [1, 2] })).toEqual({ a: [1, 2] })
  })

  it('should create new object when source has object but target has non-object', () => {
    expect(deepMergeWithArray({ a: 1 }, { a: { b: 2 } })).toEqual({ a: { b: 2 } })
  })

  it('should skip __proto__, constructor, and prototype keys', () => {
    expect(deepMergeWithArray({ a: 1 }, { __proto__: { b: 2 } } as any)).toEqual({ a: 1 })
    expect(deepMergeWithArray({ a: 1 }, { constructor: { b: 2 } })).toEqual({ a: 1 })
    expect(deepMergeWithArray({ a: 1 }, { prototype: { b: 2 } } as any)).toEqual({ a: 1 })
  })

  it('should skip non-mergable target', () => {
    expect(deepMergeWithArray(null as any, { b: 2 })).toEqual(null)
    expect(deepMergeWithArray(42 as any, { b: 2 })).toEqual(42)
  })

  it('should skip non-mergable source', () => {
    expect(deepMergeWithArray({ a: 1 }, [1, 2] as any)).toEqual({ a: 1 })
  })

  it('should handle deeply nested arrays and objects', () => {
    expect(deepMergeWithArray({ a: { b: [1] } }, { a: { b: [2] } })).toEqual({ a: { b: [1, 2] } })
  })

  it('should handle objects with null prototype as mergable', () => {
    const source = Object.create(null)
    source.b = 2
    expect(deepMergeWithArray({ a: 1 }, source as any)).toEqual({ a: 1, b: 2 })
  })

  it('should return target when no sources provided', () => {
    const target = { a: 1 }
    expect(deepMergeWithArray(target)).toBe(target)
  })

  it('should replace falsy non-array target value with source array', () => {
    expect(deepMergeWithArray({ a: 0 } as any, { a: [1, 2] })).toEqual({ a: [1, 2] })
    expect(deepMergeWithArray({ a: false } as any, { a: [1, 2] })).toEqual({ a: [1, 2] })
    expect(deepMergeWithArray({ a: '' } as any, { a: [1, 2] })).toEqual({ a: [1, 2] })
  })

  it('should merge existing array target with source array', () => {
    const target = { a: [1, 2] }
    const result = deepMergeWithArray(target, { a: [3, 4] })
    expect(result.a).toEqual([1, 2, 3, 4])
  })

  it('should correctly handle target with existing array vs undefined', () => {
    expect(deepMergeWithArray({ a: [1] } as any, { a: [2] })).toEqual({ a: [1, 2] })
    expect(deepMergeWithArray({} as any, { a: [1, 2] })).toEqual({ a: [1, 2] })
  })

  it('should replace string target with source array', () => {
    expect(deepMergeWithArray({ items: 'hello' }, { items: [1, 2, 3] })).toEqual({
      items: [1, 2, 3],
    })
  })

  it('should replace number target with source array', () => {
    expect(deepMergeWithArray({ items: 42 }, { items: [1, 2, 3] })).toEqual({ items: [1, 2, 3] })
  })

  it('should not pollute prototype via __proto__ key', () => {
    deepMerge({} as any, JSON.parse('{"__proto__": {"polluted": true}}') as any)
    expect(({} as any).polluted).toBeUndefined()
  })

  it('should not pollute prototype via constructor key', () => {
    deepMerge({ a: 1 }, { constructor: { polluted: true } } as any)
    expect(({} as any).polluted).toBeUndefined()
  })

  it('should not modify source objects during deepMerge', () => {
    const target = { a: 1 }
    const source = { b: { c: 2 } }
    const sourceCopy = { b: { c: 2 } }
    deepMerge(target, source)
    expect(source).toEqual(sourceCopy)
  })

  it('should not modify source objects during deepMergeWithArray', () => {
    const target = { a: [1] }
    const source = { a: [2], b: { c: 3 } }
    const sourceCopy = { a: [2], b: { c: 3 } }
    deepMergeWithArray(target, source)
    expect(source).toEqual(sourceCopy)
  })
})

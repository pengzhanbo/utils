import { describe, expect, it } from 'vitest'
import { deepFreeze, deepMerge, deepMergeWithArray, hasOwn, isKeyof, objectEntries, objectGet, objectKeys, objectMap, omit, pick } from './object'

describe('object > hasOwn', () => {
  it('should be true', () => {
    expect(hasOwn({ a: 1 }, 'a')).toBe(true)
  })

  it('should be false', () => {
    expect(hasOwn(null, 'a')).toBe(false)
    expect(hasOwn({ a: 1 }, 'toString')).toBe(false)
    expect(hasOwn({ a: 1 }, 'length')).toBe(false)
    expect(hasOwn({ a: 1 }, '__proto__')).toBe(false)
  })

  it('should be extends object', () => {
    const obj1 = { a: 1 }
    const obj2 = Object.create(obj1)
    obj2.b = 1

    expect(hasOwn(obj1, 'a')).toBe(true)
    expect(hasOwn(obj2, 'a')).toBe(false)
    expect(hasOwn(obj2, 'b')).toBe(true)
  })
})

describe('object > deepFreeze', () => {
  it('should work', () => {
    const obj = { a: 1 }
    deepFreeze(obj)
    expect(() => {
      obj.a = 2
    }).toThrowError()
  })

  it('should work with nested object', () => {
    const obj = { a: { b: 1 } }
    deepFreeze(obj)
    expect(() => {
      obj.a.b = 2
    }).toThrowError()
  })

  it('should work with array', () => {
    const obj = [{ a: { b: 1 } }, { a: { b: 1 } }]
    deepFreeze(obj)
    expect(() => {
      obj[1].a.b = 2
    }).toThrowError()
  })
})

describe('object > isKeyof', () => {
  it('should work', () => {
    expect(isKeyof({ a: 1 }, 'a')).toBe(true)
    expect(isKeyof({ a: 1 }, 'b')).toBe(false)
  })

  it('should work with symbol', () => {
    const symbol = Symbol('a')
    expect(isKeyof({ [symbol]: 1 }, symbol)).toBe(true)
  })

  it('should work width extends object', () => {
    const obj1 = { a: 1 }
    const obj2 = Object.create(obj1)
    obj2.b = 1

    expect(isKeyof(obj1, 'a')).toBe(true)
    expect(isKeyof(obj2, 'a')).toBe(true)
  })
})

describe('object > objectGet', () => {
  it('should work', () => {
    expect(objectGet({ a: 1 }, 'a')).toBe(1)
    expect(objectGet({ a: { b: 2 } }, 'a.b')).toBe(2)
    expect(objectGet({ a: [{ b: 2 }] }, 'a[0].b')).toBe(2)
    expect(objectGet({ a: [{ b: 2 }] }, 'a.0.b')).toBe(2)
  })

  it('should work with unknown paths', () => {
    expect(objectGet({ a: [{ b: 2 }] }, 'a.1.b')).toBe(undefined)
  })
})

describe('object > objectMap', () => {
  it('should work', () => {
    expect(objectMap({ a: 1, b: 2 }, (k, v) => [k.toString().toUpperCase(), v.toString()])).toEqual({ A: '1', B: '2' })
    expect(objectMap({ a: 1, b: 2 }, (k, v) => [v, k])).toEqual({ 1: 'a', 2: 'b' })
    expect(objectMap({ a: 1, b: 2 }, (k, v) => k === 'a' ? undefined : [k, v])).toEqual({ b: 2 })
  })
})

describe('object > objectKeys', () => {
  it('should work', () => {
    expect(objectKeys({ a: 1, b: 2 })).toEqual(['a', 'b'])
  })
})

describe('object > objectEntries', () => {
  it('should work', () => {
    expect(objectEntries({ a: 1, b: 2 })).toEqual([['a', 1], ['b', 2]])
  })
})

describe('object > omit', () => {
  it('should work', () => {
    expect(omit({ a: 1, b: 2 }, ['a'])).toEqual({ b: 2 })
    expect(omit({ a: 1, b: 2 }, ['a', 'b', 'c'] as any)).toEqual({})
  })
})

describe('object > pick', () => {
  it('should work', () => {
    expect(pick({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 })
    expect(pick({ a: 1, b: 2 }, ['a', 'b', 'c'] as any)).toEqual({ a: 1, b: 2 })
  })
})

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

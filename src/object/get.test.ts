import { describe, expect, it } from 'vitest'
import { objectGet } from './get'

describe('object > objectGet', () => {
  it('should work', () => {
    expect(objectGet({ a: 1 }, 'a')).toBe(1)
    expect(objectGet({ a: { b: 2 } }, 'a.b')).toBe(2)
    expect(objectGet({ a: [{ b: 2 }] }, 'a[0].b')).toBe(2)
    expect(objectGet({ a: [{ b: 2 }] }, 'a.0.b')).toBe(2)
    expect(objectGet({ a: [{ b: 2 }] }, 'a.0')).toEqual({ b: 2 })
  })

  it('should work with unknown paths', () => {
    expect(objectGet({ a: [{ b: 2 }] }, 'a.1.b')).toBe(undefined)
    // @ts-expect-error
    expect(objectGet({ a: 1 }, 'b')).toBe(undefined)
    // @ts-expect-error
    expect(objectGet({ a: { b: 1 } }, 'a.c')).toBe(undefined)
    // @ts-expect-error
    expect(objectGet({}, 'a')).toBe(undefined)
  })

  it('should work with nested objects', () => {
    expect(objectGet({ a: { b: { c: { d: 1 } } } }, 'a.b.c.d')).toBe(1)
    expect(objectGet({ a: { b: { c: { d: 1 } } } }, 'a.b.c')).toEqual({ d: 1 })
    expect(objectGet({ a: { b: { c: 1 } } }, 'a.b.c')).toBe(1)
  })

  it('should work with array access using bracket notation', () => {
    expect(objectGet({ a: [1, 2, 3] }, 'a[0]')).toBe(1)
    expect(objectGet({ a: [1, 2, 3] }, 'a[1]')).toBe(2)
    expect(objectGet({ a: [1, 2, 3] }, 'a[2]')).toBe(3)
    expect(objectGet({ a: [1, 2, 3] }, 'a[99]')).toBe(undefined)
  })

  it('should work with nested array access', () => {
    expect(
      objectGet(
        {
          a: [
            [1, 2],
            [3, 4],
          ],
        },
        'a.0.0',
      ),
    ).toBe(1)
    expect(
      objectGet(
        {
          a: [
            [1, 2],
            [3, 4],
          ],
        },
        'a.1.1',
      ),
    ).toBe(4)
    expect(objectGet({ a: [{ b: [1, 2] }] }, 'a.0.b.1')).toBe(2)
  })

  it('should work with mixed dot and bracket notation', () => {
    expect(objectGet({ a: [{ b: 1 }] }, 'a[0].b')).toBe(1)
  })

  it('should work with single-quoted bracket notation', () => {
    expect(objectGet({ a: { b: 1 } }, "a['b']")).toBe(1)
  })

  it('should work with quoted bracket notation containing dots', () => {
    expect(objectGet({ a: { 'b.c': 1 } }, "a['b.c']")).toBe(1)
  })

  it('should work with double-quoted bracket notation containing dots', () => {
    expect(objectGet({ a: { 'b.c': 1 } }, 'a["b.c"]')).toBe(1)
  })

  it('should work with quoted bracket notation containing special characters', () => {
    expect(objectGet({ a: { 'b"c': 1 } }, "a['b\"c']")).toBe(1)
    expect(objectGet({ a: { "b'c": 1 } }, 'a["b\'c"]')).toBe(1)
  })

  it('should work with objects having numeric keys', () => {
    expect(objectGet({ 0: { a: 1 } }, '0.a')).toBe(1)
    expect(objectGet({ a: { 0: { b: 1 } } }, 'a.0.b')).toBe(1)
  })

  it('should return undefined when accessing primitives', () => {
    // @ts-expect-error
    expect(objectGet({ a: 1 }, 'a.b')).toBe(undefined)
    // @ts-expect-error
    expect(objectGet({ a: 'hello' }, 'a.b')).toBe(undefined)
    // @ts-expect-error
    expect(objectGet({ a: null }, 'a.b')).toBe(undefined)
  })

  it('should handle null or undefined source', () => {
    // @ts-expect-error
    expect(objectGet(null as any, 'a')).toBe(undefined)
    expect(objectGet(undefined as any, 'a')).toBe(undefined)
  })

  it('should work with deeply nested paths', () => {
    const deep = { a: { b: { c: { d: { e: { f: 1 } } } } } }
    expect(objectGet(deep, 'a.b.c.d.e.f')).toBe(1)
  })

  it('should work with path containing only bracket notation', () => {
    // @ts-expect-error -- root-level bracket notation not in ObjectKeyPaths
    expect(objectGet({ a: { b: 1 } }, '["a"]')).toEqual({ b: 1 })
    expect(objectGet({ a: { b: 1 } }, 'a["b"]')).toBe(1)
  })

  it('should work with array in the middle of path', () => {
    expect(objectGet({ a: [{ b: { c: 1 } }] }, 'a[0].b.c')).toBe(1)
  })

  it('should work with empty array access', () => {
    // @ts-expect-error
    expect(objectGet({ a: [] }, 'a[0]')).toBe(undefined)
  })

  it('should handle malformed path with unclosed bracket', () => {
    const obj = { a: { b: 1 } }
    // @ts-expect-error
    expect(objectGet(obj, 'a[')).toEqual({ b: 1 })
    // @ts-expect-error
    expect(objectGet(obj, 'a[b')).toEqual({ b: 1 })
  })

  it('should skip empty bracket content', () => {
    const obj = { a: { b: 1 } }
    // @ts-expect-error
    expect(objectGet(obj, 'a[].b')).toBe(1)
  })

  it('should work with sparse arrays', () => {
    const sparse: any[] = []
    sparse[5] = { b: 1 }
    expect(objectGet({ a: sparse }, 'a[5].b')).toBe(1)
    expect(objectGet({ a: sparse }, 'a[0].b')).toBe(undefined)
  })
})

import { describe, expect, it, vi } from 'vitest'
import { memoize } from './memoize'

describe('functions > memoize', () => {
  it('should return cached result for same arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b)
    const memoizedFn = memoize(fn)
    memoizedFn(1, 2)
    memoizedFn(1, 2)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should compute for different arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b)
    const memoizedFn = memoize(fn)
    memoizedFn(1, 2)
    memoizedFn(2, 1)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should work with maxSize option', () => {
    const fn = vi.fn((x: number) => x * 2)
    const memoizedFn = memoize(fn, { maxSize: 2 })
    memoizedFn(1)
    memoizedFn(2)
    memoizedFn(3)
    memoizedFn(1)
    expect(fn).toHaveBeenCalledTimes(4)
  })

  it('should work with custom keyResolver', () => {
    const fn = vi.fn((a: number, b: number) => a + b)
    const memoizedFn = memoize(fn, {
      keyResolver: (a, b) => `${a}:${b}`,
    })
    memoizedFn(1, 2)
    memoizedFn(1, 2)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should cache by JSON stringified args by default', () => {
    const fn = vi.fn((obj: { x: number }) => obj.x)
    const memoizedFn = memoize(fn)
    memoizedFn({ x: 1 })
    memoizedFn({ x: 1 })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should clear cache when ttl expires', () => {
    let time = 1000
    const originalDateNow = Date.now
    Date.now = () => time

    const fn = vi.fn((x: number) => x * 2)
    const memoizedFn = memoize(fn, { ttl: 500 })

    memoizedFn(1)
    expect(fn).toHaveBeenCalledTimes(1)

    time = 2000
    memoizedFn(1)
    expect(fn).toHaveBeenCalledTimes(2)

    Date.now = originalDateNow
  })

  it('should expose clearCache method', () => {
    const fn = vi.fn((x: number) => x * 2)
    const memoizedFn = memoize(fn)

    memoizedFn(1)
    expect(fn).toHaveBeenCalledTimes(1)

    memoizedFn(1)
    expect(fn).toHaveBeenCalledTimes(1)

    memoizedFn.clear()

    memoizedFn(1)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should handle maxSize of 0 (always evict)', () => {
    const fn = vi.fn((x: number) => x * 2)
    const memoizedFn = memoize(fn, { maxSize: 0 })

    memoizedFn(1)
    memoizedFn(2)
    memoizedFn(3)

    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('should not cache when maxSize is 0', () => {
    let callCount = 0
    const fn = memoize(
      (n: number) => {
        callCount++
        return n * 2
      },
      { maxSize: 0 },
    )
    expect(fn(1)).toBe(2)
    expect(fn(1)).toBe(2)
    expect(callCount).toBe(2)
    expect(typeof fn.clear).toBe('function')
    fn.clear()
  })

  it('should evict oldest entries when maxSize is reached', () => {
    const fn = vi.fn((x: string) => x)
    const memoizedFn = memoize(fn, { maxSize: 2 })

    // Fill cache with 2 items
    expect(memoizedFn('a')).toBe('a')
    expect(memoizedFn('b')).toBe('b')
    expect(fn).toHaveBeenCalledTimes(2)

    // Add a third item - should trigger eviction
    expect(memoizedFn('c')).toBe('c')
    expect(fn).toHaveBeenCalledTimes(3)

    // One of the previous items should be evicted
    // So calling either 'a' or 'b' again should recompute
    const countBefore = fn.mock.calls.length
    memoizedFn('a')
    memoizedFn('b')

    // At least one of them should have been recomputed
    expect(fn.mock.calls.length).toBeGreaterThan(countBefore)
  })

  it('should use LRU eviction: frequently accessed items survive', () => {
    const fn = vi.fn((x: string) => x)
    const memoizedFn = memoize(fn, { maxSize: 2 })

    // Fill cache: [a, b]
    memoizedFn('a')
    memoizedFn('b')
    expect(fn).toHaveBeenCalledTimes(2)

    // Access 'a' again — LRU promotes 'a' to most recently used
    memoizedFn('a')
    expect(fn).toHaveBeenCalledTimes(2) // still cached

    // Insert 'c' — should evict 'b' (LRU), not 'a' (MRU)
    memoizedFn('c')
    expect(fn).toHaveBeenCalledTimes(3)

    // 'a' should still be cached (was promoted)
    memoizedFn('a')
    expect(fn).toHaveBeenCalledTimes(3) // cache hit!

    // 'b' should have been evicted
    memoizedFn('b')
    expect(fn).toHaveBeenCalledTimes(4) // cache miss
  })

  it('should preserve this context', () => {
    const obj = {
      multiplier: 2,
      method: memoize(function (this: any, n: number) {
        return n * this.multiplier
      }),
    }
    expect(obj.method(5)).toBe(10)
    expect(obj.method(5)).toBe(10)
  })

  it('should handle function that returns undefined', () => {
    const fn = vi.fn(() => undefined)
    const memoizedFn = memoize(fn)

    const result1 = memoizedFn()
    const result2 = memoizedFn()

    expect(fn).toHaveBeenCalledTimes(1)
    expect(result1).toBeUndefined()
    expect(result2).toBeUndefined()
  })

  it('should handle function with no arguments', () => {
    const fn = vi.fn(() => 42)
    const memoizedFn = memoize(fn)

    memoizedFn()
    memoizedFn()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should handle TTL of 0 (always expired)', () => {
    let time = Date.now()
    const originalDateNow = Date.now
    Date.now = () => time

    const fn = vi.fn((x: number) => x * 2)
    const memoizedFn = memoize(fn, { ttl: 0 })

    memoizedFn(1)
    expect(fn).toHaveBeenCalledTimes(1)

    // Even immediate second call should recompute since TTL=0 means always expired
    time += 1
    memoizedFn(1)
    expect(fn).toHaveBeenCalledTimes(2)

    Date.now = originalDateNow
  })

  it('should throw TypeError for circular reference arguments with default keyResolver', () => {
    const fn = vi.fn((obj: any) => obj.x)
    const memoizedFn = memoize(fn)
    const circular: any = { x: 1 }
    circular.self = circular

    expect(() => memoizedFn(circular)).toThrow(TypeError)
  })

  it('should throw RangeError when maxSize is negative', () => {
    const fn = vi.fn((x: number) => x * 2)
    expect(() => memoize(fn, { maxSize: -1 })).toThrow(RangeError)
    expect(() => memoize(fn, { maxSize: -1 })).toThrow('maxSize must be a non-negative integer')
  })

  it('should throw RangeError when ttl is negative', () => {
    const fn = vi.fn((x: number) => x * 2)
    expect(() => memoize(fn, { ttl: -1 })).toThrow(RangeError)
    expect(() => memoize(fn, { ttl: -1 })).toThrow('ttl must be a non-negative number')
  })

  it('should work with TTL and maxSize combined', () => {
    let time = 1000
    const originalDateNow = Date.now
    Date.now = () => time

    const fn = vi.fn((x: string) => x.toUpperCase())
    const memoizedFn = memoize(fn, { ttl: 500, maxSize: 2 })

    memoizedFn('a')
    memoizedFn('b')
    expect(fn).toHaveBeenCalledTimes(2)

    // Cache hit within TTL
    memoizedFn('a')
    expect(fn).toHaveBeenCalledTimes(2)

    // TTL expires
    time = 2000
    memoizedFn('a')
    expect(fn).toHaveBeenCalledTimes(3)

    Date.now = originalDateNow
  })
})

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
})

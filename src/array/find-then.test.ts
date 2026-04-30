import { describe, expect, it, vi } from 'vitest'
import { findFirstThen, findLastThen } from './find-then'

describe('findFirstThen', () => {
  it('should find the first matching element and execute callback', () => {
    const arr = [1, 2, 3, 4, 5]
    const predicate = (v: number) => v > 3
    const then = vi.fn()

    const result = findFirstThen(arr, predicate, then)

    expect(result).toBe(true)
    expect(then).toHaveBeenCalledTimes(1)
    expect(then).toHaveBeenCalledWith(4, 3, arr)
  })

  it('should return false if no element matches', () => {
    const arr = [1, 2, 3]
    const predicate = (v: number) => v > 5
    const then = vi.fn()

    const result = findFirstThen(arr, predicate, then)

    expect(result).toBe(false)
    expect(then).not.toHaveBeenCalled()
  })

  it('should start search from specified index', () => {
    const arr = [1, 2, 3, 2, 1]
    const predicate = (v: number) => v === 2
    const then = vi.fn()

    // Start from index 2, so it should find the 2 at index 3
    const result = findFirstThen(arr, predicate, then, 2)

    expect(result).toBe(true)
    expect(then).toHaveBeenCalledWith(2, 3, arr)
  })

  it('should handle empty array', () => {
    const arr: number[] = []
    const then = vi.fn()

    const result = findFirstThen(arr, () => true, then)

    expect(result).toBe(false)
    expect(then).not.toHaveBeenCalled()
  })

  it('should not infinite loop when start exceeds array bounds', () => {
    const arr = [1, 2, 3]
    const then = vi.fn()

    const result = findFirstThen(arr, (x) => x > 0, then, 100)

    expect(result).toBe(true)
    expect(then).toHaveBeenCalledWith(3, 2, arr)
  })

  it('should clamp negative start to 0 for forward search', () => {
    const arr = [1, 2, 3]
    const then = vi.fn()

    const result = findFirstThen(arr, (x) => x > 0, then, -10)

    expect(result).toBe(true)
    expect(then).toHaveBeenCalledWith(1, 0, arr)
  })

  it('should throw TypeError when start is NaN', () => {
    const arr = [1, 2, 3]
    const then = vi.fn()
    expect(() => findFirstThen(arr, (x) => x > 0, then, Number.NaN)).toThrow(TypeError)
    expect(() => findFirstThen(arr, (x) => x > 0, then, Number.NaN)).toThrow(
      'start must be a valid number',
    )
  })
})

describe('findLastThen', () => {
  it('should find the last matching element and execute callback', () => {
    const arr = [1, 2, 3, 4, 5]
    const predicate = (v: number) => v > 2
    const then = vi.fn()

    // Should find 5
    const result = findLastThen(arr, predicate, then)

    expect(result).toBe(true)
    expect(then).toHaveBeenCalledTimes(1)
    expect(then).toHaveBeenCalledWith(5, 4, arr)
  })

  it('should return false if no element matches', () => {
    const arr = [1, 2, 3]
    const predicate = (v: number) => v > 5
    const then = vi.fn()

    const result = findLastThen(arr, predicate, then)

    expect(result).toBe(false)
    expect(then).not.toHaveBeenCalled()
  })

  it('should start search from specified index (backwards)', () => {
    const arr = [1, 2, 3, 2, 1]
    const predicate = (v: number) => v === 2
    const then = vi.fn()

    // Start from index 2 (value 3), search backwards. Should find 2 at index 1
    const result = findLastThen(arr, predicate, then, 2)

    expect(result).toBe(true)
    expect(then).toHaveBeenCalledWith(2, 1, arr)
  })

  it('should handle empty array', () => {
    const arr: number[] = []
    const then = vi.fn()

    const result = findLastThen(arr, () => true, then)

    expect(result).toBe(false)
    expect(then).not.toHaveBeenCalled()
  })

  it('should not infinite loop when start is negative and exceeds bounds', () => {
    const arr = [1, 2, 3]
    const then = vi.fn()

    const result = findLastThen(arr, (x) => x > 0, then, -100)

    expect(result).toBe(false)
    expect(then).not.toHaveBeenCalled()
  })

  it('should clamp start exceeding array length for backward search', () => {
    const arr = [1, 2, 3]
    const then = vi.fn()

    const result = findLastThen(arr, (x) => x > 0, then, 100)

    expect(result).toBe(true)
    expect(then).toHaveBeenCalledWith(3, 2, arr)
  })

  it('should throw TypeError when start is NaN', () => {
    const arr = [1, 2, 3]
    const then = vi.fn()
    expect(() => findLastThen(arr, (x) => x > 0, then, Number.NaN)).toThrow(TypeError)
    expect(() => findLastThen(arr, (x) => x > 0, then, Number.NaN)).toThrow(
      'start must be a valid number',
    )
  })
})

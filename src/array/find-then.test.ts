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
})

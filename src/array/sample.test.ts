import { describe, expect, it, vi } from 'vitest'
import { sample, sampleSize } from './sample'

describe('array > sample', () => {
  it('should return a random element from the array', () => {
    const array = [1, 2, 3, 4, 5]
    const result = sample(array)
    expect(array).toContain(result)
  })

  it('should return undefined for empty array', () => {
    expect(sample([])).toBeUndefined()
  })

  it('should return the only element for single element array', () => {
    expect(sample([1])).toBe(1)
  })

  it('should return an element from the array (not modify original)', () => {
    const array = [1, 2, 3, 4, 5]
    const originalLength = array.length
    sample(array)
    expect(array.length).toBe(originalLength)
  })

  it('should return different elements over multiple calls (statistical test)', () => {
    const array = [1, 2, 3, 4, 5]
    const results = new Set<number>()

    for (let i = 0; i < 100; i++) {
      results.add(sample(array)!)
    }

    expect(results.size).toBeGreaterThan(1)
  })

  it('should work with strings', () => {
    const array = ['a', 'b', 'c']
    const result = sample(array)
    expect(array).toContain(result)
  })

  it('should work with objects', () => {
    const obj1 = { id: 1 }
    const obj2 = { id: 2 }
    const array = [obj1, obj2]
    const result = sample(array)
    expect([obj1, obj2]).toContain(result)
  })
})

describe('array > sampleSize', () => {
  it('should return n random elements from the array', () => {
    const array = [1, 2, 3, 4, 5]
    const result = sampleSize(array, 2)
    expect(result.length).toBe(2)
    result.forEach((item) => {
      expect(array).toContain(item)
    })
  })

  it('should return empty array for empty array', () => {
    expect(sampleSize([], 3)).toEqual([])
  })

  it('should return empty array for size 0', () => {
    expect(sampleSize([1, 2, 3], 0)).toEqual([])
  })

  it('should return empty array for negative size', () => {
    expect(sampleSize([1, 2, 3], -1)).toEqual([])
  })

  it('should return all elements when size >= array length', () => {
    const array = [1, 2, 3]
    const result = sampleSize(array, 5)
    expect(result.length).toBe(3)
    expect(result.sort()).toEqual([1, 2, 3])
  })

  it('should not modify the original array', () => {
    const array = [1, 2, 3, 4, 5]
    const original = [...array]
    sampleSize(array, 3)
    expect(array).toEqual(original)
  })

  it('should return unique elements', () => {
    const array = [1, 2, 3, 4, 5]
    const result = sampleSize(array, 3)
    const unique = new Set(result)
    expect(unique.size).toBe(3)
  })

  it('should return different results over multiple calls (statistical test)', () => {
    const array = [1, 2, 3, 4, 5]
    const results = new Set<string>()

    for (let i = 0; i < 50; i++) {
      results.add(sampleSize(array, 2).sort().join(','))
    }

    expect(results.size).toBeGreaterThan(1)
  })

  it('should work with strings', () => {
    const array = ['a', 'b', 'c', 'd']
    const result = sampleSize(array, 2)
    expect(result.length).toBe(2)
    result.forEach((item) => {
      expect(array).toContain(item)
    })
  })

  it('should work with objects', () => {
    const obj1 = { id: 1 }
    const obj2 = { id: 2 }
    const obj3 = { id: 3 }
    const array = [obj1, obj2, obj3]
    const result = sampleSize(array, 2)
    expect(result.length).toBe(2)
    expect(new Set(result).size).toBe(2)
  })

  it('should handle size of 1', () => {
    const array = [1, 2, 3, 4, 5]
    const result = sampleSize(array, 1)
    expect(result.length).toBe(1)
    expect(array).toContain(result[0])
  })

  it('should return all elements in random order when size equals array length', () => {
    const array = [1, 2, 3]
    const result = sampleSize(array, 3)
    expect(result.length).toBe(3)
    expect(result.sort()).toEqual([1, 2, 3])
  })

  it('should mock Math.random for deterministic behavior', () => {
    const array = [1, 2, 3, 4, 5]

    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.8)

    const result = sampleSize(array, 3)
    expect(result.length).toBe(3)

    vi.restoreAllMocks()
  })
})

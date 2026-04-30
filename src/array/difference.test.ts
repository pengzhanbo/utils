import { describe, expect, it } from 'vitest'
import { difference, differenceBy } from './difference'

describe('array > difference', () => {
  it('should return the difference of two arrays', () => {
    expect(difference([1, 2, 3], [1])).toEqual([2, 3])
    expect(difference([], [1, 2, 3])).toEqual([])
    expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3])
  })

  it('should return empty array when first array is empty', () => {
    expect(difference([], [])).toEqual([])
    expect(difference([], [1, 2, 3])).toEqual([])
  })

  it('should return first array when second array is empty', () => {
    expect(difference([1, 2, 3], [])).toEqual([1, 2, 3])
  })

  it('should return empty array for two identical arrays', () => {
    expect(difference([1, 2, 3], [1, 2, 3])).toEqual([])
  })

  it('should handle arrays with duplicate elements', () => {
    expect(difference([1, 1, 2, 2, 3], [2])).toEqual([1, 1, 3])
    expect(difference([1, 2, 2, 3], [1, 3])).toEqual([2, 2])
  })

  it('should handle NaN values', () => {
    expect(difference([1, Number.NaN, 2], [Number.NaN])).toEqual([1, 2])
    expect(difference([Number.NaN, Number.NaN], [1])).toEqual([Number.NaN, Number.NaN])
  })

  it('should not modify the original arrays', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [2]
    const arr1Copy = [...arr1]
    const arr2Copy = [...arr2]
    difference(arr1, arr2)
    expect(arr1).toEqual(arr1Copy)
    expect(arr2).toEqual(arr2Copy)
  })
})

describe('array > differenceBy', () => {
  it('should return the difference of two arrays using the `mapper` function', () => {
    expect(differenceBy([1.2, 2.3, 3.4], [1.2], Math.floor)).toEqual([2.3, 3.4])
    expect(differenceBy([], [1.2], Math.floor)).toEqual([])
  })

  it('should return first array when second array is empty', () => {
    expect(differenceBy([1.2, 2.3], [], Math.floor)).toEqual([1.2, 2.3])
  })

  it('should handle mapper returning same value for different elements', () => {
    expect(differenceBy([1.1, 1.2, 2.1], [1.9], Math.floor)).toEqual([2.1])
  })

  it('should return the difference of two arrays with different element types using the `mapper` function', () => {
    interface CSV {
      id: number
      csv: number
    }
    interface JSON {
      id: number
      json: number
    }

    const array1: CSV[] = [
      { id: 1, csv: 1 },
      { id: 2, csv: 1 },
      { id: 3, csv: 1 },
    ]
    const array2: JSON[] = [
      { id: 2, json: 2 },
      { id: 4, json: 2 },
    ]

    const result = differenceBy(array1, array2, (value) => value.id)
    expect(result).toEqual([
      { id: 1, csv: 1 },
      { id: 3, csv: 1 },
    ])
  })
})

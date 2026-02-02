import { describe, expect, it } from 'vitest'
import { difference, differenceBy } from './difference'

describe('array > difference', () => {
  it('should the difference of two arrays', () => {
    expect(difference([1, 2, 3], [1])).toEqual([2, 3])
    expect(difference([], [1, 2, 3])).toEqual([])
    expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3])
  })
})

describe('array > differenceBy', () => {
  it('should the difference of two arrays using the `mapper` function', () => {
    expect(differenceBy([1.2, 2.3, 3.4], [1.2], Math.floor)).toEqual([2.3, 3.4])
    expect(differenceBy([], [1.2], Math.floor)).toEqual([])
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

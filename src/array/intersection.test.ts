import { describe, expect, it } from 'vitest'
import { intersection, intersectionBy } from './intersection'

describe('array > intersection', () => {
  it('should the intersection of two arrays', () => {
    expect(intersection([1, 2, 3], [2])).toEqual([2])
    expect(intersection([], [1, 2, 3])).toEqual([])
    expect(intersection([1, 2, 3, 4], [2, 4])).toEqual([2, 4])
  })
})

describe('array > intersectionBy', () => {
  it('should the intersection of two arrays using the `mapper` function', () => {
    expect(intersectionBy([1.2, 2.3, 3.4], [1.2], Math.floor)).toEqual([1.2])
    expect(intersectionBy([], [1.2], Math.floor)).toEqual([])
  })

  it('should return the intersection of two arrays with different element types using the `mapper` function', () => {
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

    const result = intersectionBy(array1, array2, (value) => value.id)
    expect(result).toEqual([{ id: 2, csv: 1 }])
  })
})

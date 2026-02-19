import { describe, expect, it } from 'vitest'
import { partition } from './partition'

describe('array > partition', () => {
  it('should partition array by predicate', () => {
    const result = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0)
    expect(result).toEqual([
      [2, 4],
      [1, 3, 5],
    ])
  })

  it('should partition strings by length', () => {
    const result = partition(['a', 'bb', 'ccc', 'd'], (s) => s.length > 1)
    expect(result).toEqual([
      ['bb', 'ccc'],
      ['a', 'd'],
    ])
  })

  it('should return two empty arrays for empty array', () => {
    const result = partition([], (x) => x)
    expect(result).toEqual([[], []])
  })

  it('should handle all elements passing', () => {
    const result = partition([1, 2, 3], (n) => n > 0)
    expect(result).toEqual([[1, 2, 3], []])
  })

  it('should handle no elements passing', () => {
    const result = partition([1, 2, 3], (n) => n > 10)
    expect(result).toEqual([[], [1, 2, 3]])
  })

  it('should handle single element array', () => {
    expect(partition([1], (n) => n === 1)).toEqual([[1], []])
    expect(partition([1], (n) => n === 2)).toEqual([[], [1]])
  })

  it('should partition objects by property', () => {
    const input = [
      { id: 1, active: true },
      { id: 2, active: false },
      { id: 3, active: true },
    ]
    const [active, inactive] = partition(input, (x) => x.active)
    expect(active).toEqual([
      { id: 1, active: true },
      { id: 3, active: true },
    ])
    expect(inactive).toEqual([{ id: 2, active: false }])
  })

  it('should provide index and array to predicate', () => {
    const input = [1, 2, 3, 4, 5]
    const result = partition(input, (_, index) => index % 2 === 0)
    expect(result).toEqual([
      [1, 3, 5],
      [2, 4],
    ])
  })

  it('should preserve order within each partition', () => {
    const input = [5, 4, 3, 2, 1]
    const result = partition(input, (n) => n % 2 === 0)
    expect(result[0]).toEqual([4, 2])
    expect(result[1]).toEqual([5, 3, 1])
  })

  it('should handle complex predicates', () => {
    const input = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 17 },
      { name: 'Charlie', age: 30 },
      { name: 'David', age: 15 },
    ]
    const [adults, minors] = partition(input, (x) => x.age >= 18)
    expect(adults).toEqual([
      { name: 'Alice', age: 25 },
      { name: 'Charlie', age: 30 },
    ])
    expect(minors).toEqual([
      { name: 'Bob', age: 17 },
      { name: 'David', age: 15 },
    ])
  })

  it('should work with truthy/falsy values', () => {
    const input = [0, 1, false, true, '', 'hello', null, undefined]
    const result = partition(input, Boolean)
    expect(result[0]).toEqual([1, true, 'hello'])
    expect(result[1]).toEqual([0, false, '', null, undefined])
  })

  it('should handle arrays with mixed types', () => {
    const input: (number | string)[] = [1, 'a', 2, 'b', 3, 'c']
    const result = partition(input, (x) => typeof x === 'number')
    expect(result).toEqual([
      [1, 2, 3],
      ['a', 'b', 'c'],
    ])
  })
})

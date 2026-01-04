import { describe, expect, it } from 'vitest'
import { orderBy } from './order-by'

describe('array > orderBy', () => {
  it('should return an empty array if the input array is empty', () => {
    expect(orderBy([], [], [])).toEqual([])
  })

  it('should order strings in ascending order', () => {
    expect(orderBy(['barney', 'fred', 'pebbles'], item => item)).toEqual([
      'barney',
      'fred',
      'pebbles',
    ])

    expect(orderBy(['pebbles', 'fred', 'barney'], item => item)).toEqual([
      'barney',
      'fred',
      'pebbles',
    ])
  })

  it('should order strings in descending order', () => {
    expect(orderBy(['barney', 'fred', 'pebbles'], item => item, ['desc'])).toEqual([
      'pebbles',
      'fred',
      'barney',
    ])
  })

  it('should order numbers in ascending order', () => {
    expect(orderBy([4, 2, 8, 6], item => item)).toEqual([2, 4, 6, 8])
    expect(orderBy([112, 223, 101, 88], item => item)).toEqual([88, 101, 112, 223])
  })

  it('should order numbers in descending order', () => {
    expect(orderBy([4, 2, 8, 6], item => item, ['desc'])).toEqual([8, 6, 4, 2])
  })

  interface User {
    user: string
    age: number
  }

  const users: User[] = [
    { user: 'fred', age: 48 },
    { user: 'barney', age: 34 },
    { user: 'fred', age: 40 },
    { user: 'barney', age: 36 },
  ]

  it('should order objects by a single property in ascending order', () => {
    expect(orderBy(users, ['user'])).toEqual([
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
    ])
  })

  it('should order objects by a single property in descending order', () => {
    expect(orderBy(users, ['user'], ['desc'])).toEqual([
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
    ])
  })

  it('should order objects by multiple properties', () => {
    expect(orderBy(users, ['user', 'age'], ['asc', 'desc'])).toEqual([
      { user: 'barney', age: 36 },
      { user: 'barney', age: 34 },
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
    ])
  })

  const users2 = [
    { user: 'fred', age: 48 },
    { user: 'barney', age: 36 },
    { user: 'fred', age: 40 },
    { user: 'barney', age: 34 },
  ]

  it('should extend orders if orders length is less than keys length', () => {
    expect(orderBy(users2, ['user', 'age'], ['asc'])).toEqual([
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'fred', age: 48 },
    ])
  })

  it('should order objects by criteria functions', () => {
    expect(orderBy(users2, [obj => obj.user, obj => obj.age], ['asc'])).toEqual([
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'fred', age: 48 },
    ])
  })
})

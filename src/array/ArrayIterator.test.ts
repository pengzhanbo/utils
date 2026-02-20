import { describe, expect, it } from 'vitest'
import { ArrayIterator } from './ArrayIterator'

describe('array > ArrayIterator', () => {
  describe('constructor', () => {
    it('should create an iterator from an array', () => {
      const iterator = new ArrayIterator([1, 2, 3])
      expect(iterator.toArray()).toEqual([1, 2, 3])
    })

    it('should handle empty array', () => {
      const iterator = new ArrayIterator([])
      expect(iterator.toArray()).toEqual([])
    })

    it('should not modify the original array', () => {
      const original = [1, 2, 3]
      const iterator = new ArrayIterator(original)
      iterator.map((v) => v * 2).toArray()
      expect(original).toEqual([1, 2, 3])
    })
  })

  describe('filter', () => {
    it('should filter elements based on predicate', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5]).filter((v) => v > 2).toArray()
      expect(result).toEqual([3, 4, 5])
    })

    it('should return empty array when no elements match', () => {
      const result = new ArrayIterator([1, 2, 3]).filter(() => false).toArray()
      expect(result).toEqual([])
    })

    it('should return all elements when all match', () => {
      const result = new ArrayIterator([1, 2, 3]).filter(() => true).toArray()
      expect(result).toEqual([1, 2, 3])
    })

    it('should provide correct index to predicate', () => {
      const indices: number[] = []
      new ArrayIterator([1, 2, 3])
        .filter((_, index) => {
          indices.push(index)
          return true
        })
        .toArray()
      expect(indices).toEqual([0, 1, 2])
    })

    it('should throw TypeError when predicate is not a function', () => {
      expect(() => {
        new ArrayIterator([1, 2, 3]).filter('not a function' as any)
      }).toThrow(TypeError)
      expect(() => {
        new ArrayIterator([1, 2, 3]).filter('not a function' as any)
      }).toThrow('predicate must be a function')
    })
  })

  describe('map', () => {
    it('should transform elements using transform function', () => {
      const result = new ArrayIterator([1, 2, 3]).map((v) => v * 2).toArray()
      expect(result).toEqual([2, 4, 6])
    })

    it('should transform to different type', () => {
      const result = new ArrayIterator([1, 2, 3]).map((v) => String(v)).toArray()
      expect(result).toEqual(['1', '2', '3'])
    })

    it('should provide correct index to transform', () => {
      const indices: number[] = []
      new ArrayIterator([1, 2, 3])
        .map((v, index) => {
          indices.push(index)
          return v
        })
        .toArray()
      expect(indices).toEqual([0, 1, 2])
    })

    it('should throw TypeError when transform is not a function', () => {
      expect(() => {
        new ArrayIterator([1, 2, 3]).map('not a function' as any)
      }).toThrow(TypeError)
      expect(() => {
        new ArrayIterator([1, 2, 3]).map('not a function' as any)
      }).toThrow('transform must be a function')
    })
  })

  describe('take', () => {
    it('should take first N elements', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5]).take(3).toArray()
      expect(result).toEqual([1, 2, 3])
    })

    it('should return all elements when limit is greater than length', () => {
      const result = new ArrayIterator([1, 2, 3]).take(10).toArray()
      expect(result).toEqual([1, 2, 3])
    })

    it('should return empty array when limit is 0', () => {
      const result = new ArrayIterator([1, 2, 3]).take(0).toArray()
      expect(result).toEqual([])
    })

    it('should throw TypeError when limit is negative', () => {
      expect(() => {
        new ArrayIterator([1, 2, 3]).take(-1)
      }).toThrow(TypeError)
      expect(() => {
        new ArrayIterator([1, 2, 3]).take(-1)
      }).toThrow('limit must be a non-negative integer')
    })

    it('should throw TypeError when limit is not an integer', () => {
      expect(() => {
        new ArrayIterator([1, 2, 3]).take(1.5)
      }).toThrow(TypeError)
      expect(() => {
        new ArrayIterator([1, 2, 3]).take(1.5)
      }).toThrow('limit must be a non-negative integer')
    })

    it('should throw TypeError when limit is not a number', () => {
      expect(() => {
        new ArrayIterator([1, 2, 3]).take('2' as any)
      }).toThrow(TypeError)
      expect(() => {
        new ArrayIterator([1, 2, 3]).take('2' as any)
      }).toThrow('limit must be a non-negative integer')
    })
  })

  describe('drop', () => {
    it('should drop first N elements', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5]).drop(2).toArray()
      expect(result).toEqual([3, 4, 5])
    })

    it('should return empty array when count >= length', () => {
      const result = new ArrayIterator([1, 2, 3]).drop(5).toArray()
      expect(result).toEqual([])
    })

    it('should return all elements when count is 0', () => {
      const result = new ArrayIterator([1, 2, 3]).drop(0).toArray()
      expect(result).toEqual([1, 2, 3])
    })

    it('should throw TypeError when count is negative', () => {
      expect(() => {
        new ArrayIterator([1, 2, 3]).drop(-1)
      }).toThrow(TypeError)
      expect(() => {
        new ArrayIterator([1, 2, 3]).drop(-1)
      }).toThrow('count must be a non-negative integer')
    })

    it('should throw TypeError when count is not an integer', () => {
      expect(() => {
        new ArrayIterator([1, 2, 3]).drop(1.5)
      }).toThrow(TypeError)
      expect(() => {
        new ArrayIterator([1, 2, 3]).drop(1.5)
      }).toThrow('count must be a non-negative integer')
    })
  })

  describe('forEach', () => {
    it('should execute callback for each element', () => {
      const values: number[] = []
      const indices: number[] = []

      new ArrayIterator([1, 2, 3]).forEach((value, index) => {
        values.push(value)
        indices.push(index)
      })

      expect(values).toEqual([1, 2, 3])
      expect(indices).toEqual([0, 1, 2])
    })

    it('should work with empty array', () => {
      let callCount = 0

      new ArrayIterator([]).forEach(() => {
        callCount++
      })

      expect(callCount).toBe(0)
    })

    it('should work with chained operations', () => {
      const values: number[] = []

      new ArrayIterator([1, 2, 3, 4, 5])
        .filter((v) => v > 2)
        .forEach((value) => {
          values.push(value)
        })

      expect(values).toEqual([3, 4, 5])
    })

    it('should throw TypeError when callback is not a function', () => {
      expect(() => {
        new ArrayIterator([1, 2, 3]).forEach('not a function' as any)
      }).toThrow(TypeError)
      expect(() => {
        new ArrayIterator([1, 2, 3]).forEach('not a function' as any)
      }).toThrow('callback must be a function')
    })
  })

  describe('every', () => {
    it('should return true when all elements pass the test', () => {
      expect(new ArrayIterator([2, 4, 6]).every((v) => v % 2 === 0)).toBe(true)
    })

    it('should return false when some elements fail the test', () => {
      expect(new ArrayIterator([2, 3, 4]).every((v) => v % 2 === 0)).toBe(false)
    })

    it('should return true for empty array', () => {
      expect(new ArrayIterator([]).every(() => false)).toBe(true)
    })

    it('should work with chained operations', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5]).filter((v) => v > 2).every((v) => v > 2)
      expect(result).toBe(true)
    })

    it('should throw TypeError when predicate is not a function', () => {
      expect(() => {
        new ArrayIterator([1, 2, 3]).every('not a function' as any)
      }).toThrow(TypeError)
      expect(() => {
        new ArrayIterator([1, 2, 3]).every('not a function' as any)
      }).toThrow('predicate must be a function')
    })

    it('should stop iteration on first failure', () => {
      let iterations = 0
      new ArrayIterator([1, 2, 3, 4, 5]).every((value) => {
        iterations++
        return value < 3
      })
      expect(iterations).toBe(3)
    })
  })

  describe('some', () => {
    it('should return true when at least one element passes the test', () => {
      expect(new ArrayIterator([1, 2, 3]).some((v) => v % 2 === 0)).toBe(true)
    })

    it('should return false when no elements pass the test', () => {
      expect(new ArrayIterator([1, 3, 5]).some((v) => v % 2 === 0)).toBe(false)
    })

    it('should return false for empty array', () => {
      expect(new ArrayIterator([]).some(() => true)).toBe(false)
    })

    it('should work with chained operations', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5]).filter((v) => v > 2).some((v) => v > 4)
      expect(result).toBe(true)
    })

    it('should throw TypeError when predicate is not a function', () => {
      expect(() => {
        new ArrayIterator([1, 2, 3]).some('not a function' as any)
      }).toThrow(TypeError)
      expect(() => {
        new ArrayIterator([1, 2, 3]).some('not a function' as any)
      }).toThrow('predicate must be a function')
    })

    it('should stop iteration on first success', () => {
      let iterations = 0
      new ArrayIterator([1, 2, 3, 4, 5]).some((value) => {
        iterations++
        return value === 2
      })
      expect(iterations).toBe(2)
    })
  })

  describe('find', () => {
    it('should return the first element that passes the test', () => {
      expect(new ArrayIterator([1, 2, 3, 4]).find((v) => v > 2)).toBe(3)
    })

    it('should return undefined when no element passes the test', () => {
      expect(new ArrayIterator([1, 2, 3]).find((v) => v > 10)).toBe(undefined)
    })

    it('should return undefined for empty array', () => {
      expect(new ArrayIterator([]).find(() => true)).toBe(undefined)
    })

    it('should work with chained operations', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5]).filter((v) => v > 2).find((v) => v > 3)
      expect(result).toBe(4)
    })

    it('should throw TypeError when predicate is not a function', () => {
      expect(() => {
        new ArrayIterator([1, 2, 3]).find('not a function' as any)
      }).toThrow(TypeError)
      expect(() => {
        new ArrayIterator([1, 2, 3]).find('not a function' as any)
      }).toThrow('predicate must be a function')
    })
  })

  describe('toArray', () => {
    it('should return all elements', () => {
      expect(new ArrayIterator([1, 2, 3]).toArray()).toEqual([1, 2, 3])
    })

    it('should return empty array for empty input', () => {
      expect(new ArrayIterator([]).toArray()).toEqual([])
    })
  })

  describe('chaining', () => {
    it('should support filter -> map chaining', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5])
        .filter((v) => v > 2)
        .map((v) => v * 2)
        .toArray()
      expect(result).toEqual([6, 8, 10])
    })

    it('should support map -> filter chaining', () => {
      const result = new ArrayIterator([1, 2, 3, 4])
        .map((v) => v * 2)
        .filter((v) => v > 4)
        .toArray()
      expect(result).toEqual([6, 8])
    })

    it('should support filter -> take chaining', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5])
        .filter((v) => v > 1)
        .take(2)
        .toArray()
      expect(result).toEqual([2, 3])
    })

    it('should support map -> take chaining', () => {
      const result = new ArrayIterator([1, 2, 3, 4])
        .map((v) => v * 2)
        .take(2)
        .toArray()
      expect(result).toEqual([2, 4])
    })

    it('should support take -> filter chaining', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5])
        .take(4)
        .filter((v) => v > 2)
        .toArray()
      expect(result).toEqual([3, 4])
    })

    it('should support drop -> filter chaining', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5])
        .drop(2)
        .filter((v) => v > 3)
        .toArray()
      expect(result).toEqual([4, 5])
    })

    it('should support filter -> drop chaining', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5, 6])
        .filter((v) => v > 1)
        .drop(2)
        .toArray()
      expect(result).toEqual([4, 5, 6])
    })

    it('should support full chain: filter -> map -> take', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5, 6, 7, 8])
        .filter((v) => v > 2)
        .map((v) => v * 2)
        .take(3)
        .toArray()
      expect(result).toEqual([6, 8, 10])
    })

    it('should support full chain: drop -> filter -> map', () => {
      const result = new ArrayIterator([1, 2, 3, 4, 5, 6])
        .drop(2)
        .filter((v) => v > 3)
        .map((v) => v * 2)
        .toArray()
      expect(result).toEqual([8, 10, 12])
    })

    it('should return new iterator instance on each operation', () => {
      const iterator1 = new ArrayIterator([1, 2, 3])
      const iterator2 = iterator1.filter(() => true)
      const iterator3 = iterator2.map((v) => v)
      expect(iterator1).not.toBe(iterator2)
      expect(iterator2).not.toBe(iterator3)
    })
  })

  describe('lazy evaluation', () => {
    it('should not execute operations until toArray is called', () => {
      let filterCalled = false
      let mapCalled = false

      const iterator = new ArrayIterator([1, 2, 3])
        .filter(() => {
          filterCalled = true
          return true
        })
        .map((v) => {
          mapCalled = true
          return v
        })

      expect(filterCalled).toBe(false)
      expect(mapCalled).toBe(false)

      iterator.toArray()

      expect(filterCalled).toBe(true)
      expect(mapCalled).toBe(true)
    })

    it('should process each element only once (single pass)', () => {
      let filterCallCount = 0
      let mapCallCount = 0

      const result = new ArrayIterator([1, 2, 3, 4, 5])
        .filter(() => {
          filterCallCount++
          return true
        })
        .map((v) => {
          mapCallCount++
          return v * 2
        })
        .take(3)
        .toArray()

      expect(result).toEqual([2, 4, 6])
      expect(filterCallCount).toBe(3)
      expect(mapCallCount).toBe(3)
    })

    it('should stop iteration early when take limit is reached', () => {
      let iterationCount = 0

      new ArrayIterator([1, 2, 3, 4, 5])
        .filter(() => {
          iterationCount++
          return true
        })
        .take(2)
        .toArray()

      expect(iterationCount).toBe(2)
    })

    it('should only process elements that pass filter', () => {
      let mapCallCount = 0

      const result = new ArrayIterator([1, 2, 3, 4, 5])
        .filter((v) => v > 2)
        .map((v) => {
          mapCallCount++
          return v * 2
        })
        .toArray()

      expect(result).toEqual([6, 8, 10])
      expect(mapCallCount).toBe(3)
    })
  })

  describe('Symbol.iterator', () => {
    it('should be iterable with for...of loop', () => {
      const iterator = new ArrayIterator([1, 2, 3])
      const values: number[] = []
      for (const value of iterator) {
        values.push(value)
      }
      expect(values).toEqual([1, 2, 3])
    })

    it('should work with spread operator', () => {
      const iterator = new ArrayIterator([1, 2, 3])
      const result = [...iterator]
      expect(result).toEqual([1, 2, 3])
    })

    it('should work with Array.from', () => {
      const iterator = new ArrayIterator([1, 2, 3])
      const result = Array.from(iterator)
      expect(result).toEqual([1, 2, 3])
    })

    it('should work with destructuring', () => {
      const iterator = new ArrayIterator([1, 2, 3])
      const [first, second, third] = iterator
      expect(first).toBe(1)
      expect(second).toBe(2)
      expect(third).toBe(3)
    })

    it('should work with chained operations in for...of', () => {
      const iterator = new ArrayIterator([1, 2, 3, 4, 5]).filter((v) => v > 2).map((v) => v * 2)

      const values: number[] = []
      for (const value of iterator) {
        values.push(value)
      }
      expect(values).toEqual([6, 8, 10])
    })

    it('should work with spread operator after chained operations', () => {
      const iterator = new ArrayIterator([1, 2, 3, 4]).filter((v) => v > 2).map((v) => v * 2)

      const result = [...iterator]
      expect(result).toEqual([6, 8])
    })

    it('should work with Set constructor', () => {
      const iterator = new ArrayIterator([1, 2, 2, 3])
      const set = new Set(iterator)
      expect(set.size).toBe(3)
    })

    it('should work with Map constructor with entries', () => {
      const iterator = new ArrayIterator<[string, number]>([
        ['a', 1],
        ['b', 2],
      ])
      const map = new Map(iterator)
      expect(map.size).toBe(2)
      expect(map.get('a')).toBe(1)
      expect(map.get('b')).toBe(2)
    })
  })

  describe('different value types', () => {
    it('should work with string values', () => {
      const result = new ArrayIterator(['a', 'b', 'c']).map((s) => s.toUpperCase()).toArray()
      expect(result).toEqual(['A', 'B', 'C'])
    })

    it('should work with object values', () => {
      const result = new ArrayIterator([{ x: 1 }, { x: 2 }]).map((obj) => obj.x).toArray()
      expect(result).toEqual([1, 2])
    })

    it('should work with null values', () => {
      const result = new ArrayIterator([1, null, 3]).filter((v) => v !== null).toArray()
      expect(result).toEqual([1, 3])
    })

    it('should work with undefined values', () => {
      const result = new ArrayIterator([1, undefined, 3]).filter((v) => v !== undefined).toArray()
      expect(result).toEqual([1, 3])
    })

    it('should work with mixed types', () => {
      const result = new ArrayIterator([1, 'two', true, null]).map((v) => typeof v).toArray()
      expect(result).toEqual(['number', 'string', 'boolean', 'object'])
    })
  })
})

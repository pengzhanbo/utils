import { describe, expect, it } from 'vitest'
import { ObjectIterator } from './ObjectIterator'

describe('object > ObjectIterator', () => {
  describe('constructor', () => {
    it('should create an iterator from an object', () => {
      const iterator = new ObjectIterator({ a: 1, b: 2 })
      expect(iterator.toArray()).toEqual([
        ['a', 1],
        ['b', 2],
      ])
    })

    it('should handle empty object', () => {
      const iterator = new ObjectIterator({})
      expect(iterator.toArray()).toEqual([])
    })

    it('should not modify the original object', () => {
      const original = { a: 1, b: 2 }
      const iterator = new ObjectIterator(original)
      iterator.map((k, v) => [k, v * 2]).toArray()
      expect(original).toEqual({ a: 1, b: 2 })
    })
  })

  describe('filter', () => {
    it('should filter entries based on predicate', () => {
      const result = new ObjectIterator({ a: 1, b: 2, c: 3 }).filter((_, v) => v > 1).toArray()
      expect(result).toEqual([
        ['b', 2],
        ['c', 3],
      ])
    })

    it('should filter entries based on key', () => {
      const result = new ObjectIterator({ a: 1, b: 2, c: 3 }).filter((k) => k !== 'b').toArray()
      expect(result).toEqual([
        ['a', 1],
        ['c', 3],
      ])
    })

    it('should return empty array when no entries match', () => {
      const result = new ObjectIterator({ a: 1, b: 2 }).filter(() => false).toArray()
      expect(result).toEqual([])
    })

    it('should return all entries when all match', () => {
      const result = new ObjectIterator({ a: 1, b: 2 }).filter(() => true).toArray()
      expect(result).toEqual([
        ['a', 1],
        ['b', 2],
      ])
    })

    it('should throw TypeError when predicate is not a function', () => {
      expect(() => {
        new ObjectIterator({ a: 1 }).filter('not a function' as any)
      }).toThrow(TypeError)
      expect(() => {
        new ObjectIterator({ a: 1 }).filter('not a function' as any)
      }).toThrow('predicate must be a function')
    })
  })

  describe('map', () => {
    it('should transform entries using transform function', () => {
      const result = new ObjectIterator({ a: 1, b: 2 })
        .map((k, v) => [k.toUpperCase(), v * 2])
        .toArray()
      expect(result).toEqual([
        ['A', 2],
        ['B', 4],
      ])
    })

    it('should allow swapping key and value', () => {
      const result = new ObjectIterator({ a: 1, b: 2 }).map((k, v) => [String(v), k]).toArray()
      expect(result).toEqual([
        ['1', 'a'],
        ['2', 'b'],
      ])
    })

    it('should handle different value types', () => {
      const result = new ObjectIterator({ a: 'hello', b: true, c: null })
        .map((k, v) => [k, typeof v])
        .toArray()
      expect(result).toEqual([
        ['a', 'string'],
        ['b', 'boolean'],
        ['c', 'object'],
      ])
    })

    it('should throw TypeError when transform is not a function', () => {
      expect(() => {
        new ObjectIterator({ a: 1 }).map('not a function' as any)
      }).toThrow(TypeError)
      expect(() => {
        new ObjectIterator({ a: 1 }).map('not a function' as any)
      }).toThrow('transform must be a function')
    })
  })

  describe('chaining', () => {
    it('should support filter -> map chaining', () => {
      const result = new ObjectIterator({ a: 1, b: 2, c: 3 })
        .filter((_, v) => v > 1)
        .map((k, v) => [k.toUpperCase(), v * 2])
        .toArray()
      expect(result).toEqual([
        ['B', 4],
        ['C', 6],
      ])
    })

    it('should support map -> filter chaining', () => {
      const result = new ObjectIterator({ a: 1, b: 2, c: 3 })
        .map((k, v) => [k.toUpperCase(), v * 2])
        .filter((k) => k !== 'A')
        .toArray()
      expect(result).toEqual([
        ['B', 4],
        ['C', 6],
      ])
    })

    it('should return new iterator instance on each operation', () => {
      const iterator1 = new ObjectIterator({ a: 1, b: 2 })
      const iterator2 = iterator1.filter(() => true)
      const iterator3 = iterator2.map((k, v) => [k, v])
      expect(iterator1).not.toBe(iterator2)
      expect(iterator2).not.toBe(iterator3)
    })
  })

  describe('lazy evaluation', () => {
    it('should not execute operations until toArray is called', () => {
      let filterCalled = false
      let mapCalled = false

      const iterator = new ObjectIterator({ a: 1, b: 2 })
        .filter(() => {
          filterCalled = true
          return true
        })
        .map((k, v) => {
          mapCalled = true
          return [k, v]
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

      const result = new ObjectIterator({ a: 1, b: 2, c: 3, d: 4, e: 5 })
        .filter(() => {
          filterCallCount++
          return true
        })
        .map((k, v) => {
          mapCallCount++
          return [k, v * 2]
        })
        .toArray()

      expect(result).toEqual([
        ['a', 2],
        ['b', 4],
        ['c', 6],
        ['d', 8],
        ['e', 10],
      ])
      expect(filterCallCount).toBe(5)
      expect(mapCallCount).toBe(5)
    })

    it('should only process elements that pass filter', () => {
      let mapCallCount = 0

      const result = new ObjectIterator({ a: 1, b: 2, c: 3, d: 4 })
        .filter((_, v) => v > 2)
        .map((k, v) => {
          mapCallCount++
          return [k, v * 2]
        })
        .toArray()

      expect(result).toEqual([
        ['c', 6],
        ['d', 8],
      ])
      expect(mapCallCount).toBe(2)
    })
  })

  describe('different value types', () => {
    it('should handle object values', () => {
      const result = new ObjectIterator({ a: { nested: 1 }, b: { nested: 2 } })
        .map((k, v) => [k, v.nested])
        .toArray()
      expect(result).toEqual([
        ['a', 1],
        ['b', 2],
      ])
    })

    it('should handle array values', () => {
      const result = new ObjectIterator({ a: [1, 2], b: [3, 4] })
        .map((k, v) => [k, v.length])
        .toArray()
      expect(result).toEqual([
        ['a', 2],
        ['b', 2],
      ])
    })

    it('should handle null values', () => {
      const result = new ObjectIterator({ a: null, b: 1 }).filter((_, v) => v !== null).toArray()
      expect(result).toEqual([['b', 1]])
    })

    it('should handle undefined values', () => {
      const result = new ObjectIterator({ a: undefined, b: 1 })
        .filter((_, v) => v !== undefined)
        .toArray()
      expect(result).toEqual([['b', 1]])
    })

    it('should handle function values', () => {
      const fn = () => 'test'
      const result = new ObjectIterator({ a: fn }).map((k, v) => [k, typeof v]).toArray()
      expect(result).toEqual([['a', 'function']])
    })

    it('should handle symbol values', () => {
      const sym = Symbol('test')
      const result = new ObjectIterator({ a: sym }).map((k, v) => [k, typeof v]).toArray()
      expect(result).toEqual([['a', 'symbol']])
    })
  })

  describe('iterable protocol', () => {
    it('should be iterable with for...of loop', () => {
      const iterator = new ObjectIterator({ a: 1, b: 2, c: 3 })
      const result: Array<[string, any]> = []
      for (const entry of iterator) {
        result.push(entry)
      }
      expect(result).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    })

    it('should work with spread operator', () => {
      const iterator = new ObjectIterator({ a: 1, b: 2 })
      const result = [...iterator]
      expect(result).toEqual([
        ['a', 1],
        ['b', 2],
      ])
    })

    it('should work with Array.from', () => {
      const iterator = new ObjectIterator({ a: 1, b: 2 })
      const result = Array.from(iterator)
      expect(result).toEqual([
        ['a', 1],
        ['b', 2],
      ])
    })

    it('should work with destructuring', () => {
      const iterator = new ObjectIterator({ a: 1, b: 2, c: 3 })
      const [first, second, third] = iterator
      expect(first).toEqual(['a', 1])
      expect(second).toEqual(['b', 2])
      expect(third).toEqual(['c', 3])
    })

    it('should work with chained operations in for...of', () => {
      const iterator = new ObjectIterator({ a: 1, b: 2, c: 3, d: 4 })
        .filter((_, v) => v > 1)
        .map((k, v) => [k.toUpperCase(), v * 2])

      const result: Array<[string, any]> = []
      for (const entry of iterator) {
        result.push(entry)
      }
      expect(result).toEqual([
        ['B', 4],
        ['C', 6],
        ['D', 8],
      ])
    })

    it('should work with spread operator after chained operations', () => {
      const iterator = new ObjectIterator({ a: 1, b: 2, c: 3 })
        .filter((_, v) => v > 1)
        .map((k, v) => [k.toUpperCase(), v * 2])

      const result = [...iterator]
      expect(result).toEqual([
        ['B', 4],
        ['C', 6],
      ])
    })

    it('should work with Set constructor', () => {
      const iterator = new ObjectIterator({ a: 1, b: 2 })
      const set = new Set(iterator)
      expect(set.size).toBe(2)
      const entries = [...set]
      expect(entries).toEqual([
        ['a', 1],
        ['b', 2],
      ])
    })

    it('should work with Map constructor', () => {
      const iterator = new ObjectIterator({ a: 1, b: 2 })
      const map = new Map(iterator)
      expect(map.size).toBe(2)
      expect(map.get('a')).toBe(1)
      expect(map.get('b')).toBe(2)
    })
  })
})

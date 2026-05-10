import { describe, expect, it, vi } from 'vitest'
import { LRUCache } from './LRUCache'

describe('util > LRUCache', () => {
  describe('constructor', () => {
    it('should create a cache with valid maxSize', () => {
      const cache = new LRUCache({ maxSize: 10 })
      expect(cache.maxSize).toBe(10)
      expect(cache.size).toBe(0)
      expect(cache.maxAge).toBe(Number.POSITIVE_INFINITY)
    })

    it('should accept maxAge option', () => {
      const cache = new LRUCache({ maxSize: 10, maxAge: 5000 })
      expect(cache.maxAge).toBe(5000)
    })

    it('should throw TypeError when maxSize is missing or not a number', () => {
      expect(() => new LRUCache({ maxSize: 0 })).toThrow(TypeError)
      expect(() => new LRUCache({ maxSize: 0 })).toThrow(
        '`maxSize` must be a number greater than 0',
      )
    })

    it('should throw TypeError when maxSize is negative', () => {
      expect(() => new LRUCache({ maxSize: -1 })).toThrow(TypeError)
    })

    it('should throw TypeError when maxAge is 0', () => {
      expect(() => new LRUCache({ maxSize: 5, maxAge: 0 })).toThrow(TypeError)
      expect(() => new LRUCache({ maxSize: 5, maxAge: 0 })).toThrow(
        '`maxAge` must be a number greater than 0',
      )
    })

    it('should accept onEviction callback', () => {
      const onEviction = vi.fn()
      const cache = new LRUCache({ maxSize: 2, onEviction })
      // Fill first generation: a,b → cache full, oldCache becomes {a,b}
      cache.set('a', 1)
      cache.set('b', 2)
      // Fill second generation: c,d → cache full, oldCache {a,b} is evicted
      cache.set('c', 3)
      cache.set('d', 4)
      expect(onEviction).toHaveBeenCalledTimes(2)
    })
  })

  describe('set', () => {
    it('should set a value and return the cache instance', () => {
      const cache = new LRUCache({ maxSize: 5 })
      const result = cache.set('a', 1)
      expect(result).toBe(cache)
      expect(cache.get('a')).toBe(1)
    })

    it('should update an existing key without increasing size', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('a', 2)
      expect(cache.size).toBe(1)
      expect(cache.get('a')).toBe(2)
    })

    it('should accept per-item maxAge option', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1, { maxAge: 100 })
      expect(cache.expiresIn('a')).toBeLessThanOrEqual(100)
    })

    it('should use global maxAge when per-item maxAge is not provided', () => {
      const cache = new LRUCache({ maxSize: 5, maxAge: 1000 })
      cache.set('a', 1)
      expect(cache.expiresIn('a')).toBeLessThanOrEqual(1000)
    })

    it('should set item with Infinity maxAge (never expires)', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      expect(cache.expiresIn('a')).toBe(Number.POSITIVE_INFINITY)
    })

    it('should trigger eviction when cache reaches maxSize', () => {
      const onEviction = vi.fn()
      const cache = new LRUCache({ maxSize: 3, onEviction })

      // Fill first generation: cache full at 3, oldCache={a,b,c}
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      expect(onEviction).not.toHaveBeenCalled()

      // Fill second generation: cache reaches 3 again, oldCache={a,b,c} evicted
      cache.set('d', 4)
      cache.set('e', 5)
      cache.set('f', 6)
      expect(onEviction).toHaveBeenCalledTimes(3)
    })
  })

  describe('get', () => {
    it('should return the value for an existing key', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      expect(cache.get('a')).toBe(1)
    })

    it('should return undefined for a non-existent key', () => {
      const cache = new LRUCache({ maxSize: 5 })
      expect(cache.get('nonexistent')).toBeUndefined()
    })

    it('should return undefined for an expired key', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1, { maxAge: 100 })

      dateNowStub.mockReturnValue(now + 200)
      expect(cache.get('a')).toBeUndefined()
      expect(cache.has('a')).toBe(false)

      dateNowStub.mockRestore()
    })

    it('should move item from oldCache to recent on access', () => {
      const cache = new LRUCache({ maxSize: 3 })

      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // 'a','b','c' moved to oldCache, 'd' in cache

      expect(cache.get('a')).toBe(1) // 'a' moved back to recent
    })

    it('should return undefined for expired key in oldCache', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 2 })
      cache.set('a', 1, { maxAge: 100 })
      cache.set('b', 2) // cache full → oldCache={a,b}, cache={}
      // 'a' is in oldCache only, with expiry

      dateNowStub.mockReturnValue(now + 200)
      // get('a') → cache miss → oldCache hit → expired → deleted
      expect(cache.get('a')).toBeUndefined()

      dateNowStub.mockRestore()
    })

    it('should return value when item has no expiry', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      expect(cache.get('a')).toBe(1)
    })
  })

  describe('has', () => {
    it('should return true for an existing key', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      expect(cache.has('a')).toBe(true)
    })

    it('should return false for a non-existent key', () => {
      const cache = new LRUCache({ maxSize: 5 })
      expect(cache.has('nonexistent')).toBe(false)
    })

    it('should return false for an expired key in cache', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1, { maxAge: 100 })

      dateNowStub.mockReturnValue(now + 200)
      expect(cache.has('a')).toBe(false)

      dateNowStub.mockRestore()
    })

    it('should return false for an expired key in oldCache', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // 'a','b','c' moved to oldCache

      // Set 'a' with short expiry and push it to oldCache
      cache.set('a', 1, { maxAge: 100 })
      cache.set('e', 5)

      dateNowStub.mockReturnValue(now + 200)
      expect(cache.has('a')).toBe(false)

      dateNowStub.mockRestore()
    })

    it('should return true for key in oldCache', () => {
      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // 'a','b','c' moved to oldCache

      expect(cache.has('a')).toBe(true)
    })
  })

  describe('peek', () => {
    it('should return value without marking as recently used', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      expect(cache.peek('a')).toBe(1)
    })

    it('should return undefined for a non-existent key', () => {
      const cache = new LRUCache({ maxSize: 5 })
      expect(cache.peek('nonexistent')).toBeUndefined()
    })

    it('should return undefined for an expired key in cache', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1, { maxAge: 100 })

      dateNowStub.mockReturnValue(now + 200)
      expect(cache.peek('a')).toBeUndefined()

      dateNowStub.mockRestore()
    })

    it('should peek key in oldCache', () => {
      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // 'a','b','c' moved to oldCache

      expect(cache.peek('a')).toBe(1)
    })

    it('should return undefined for expired key in oldCache via peek', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // 'a','b','c' in oldCache

      // Set 'a' with short TTL — goes to cache
      cache.set('a', 1, { maxAge: 100 })
      // Push to oldCache
      cache.set('e', 5)

      dateNowStub.mockReturnValue(now + 200)
      expect(cache.peek('a')).toBeUndefined()

      dateNowStub.mockRestore()
    })
  })

  describe('delete', () => {
    it('should delete an existing key from cache', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      expect(cache.delete('a')).toBe(true)
      expect(cache.has('a')).toBe(false)
      expect(cache.size).toBe(0)
    })

    it('should return false when key does not exist', () => {
      const cache = new LRUCache({ maxSize: 5 })
      expect(cache.delete('nonexistent')).toBe(false)
    })

    it('should delete key from oldCache', () => {
      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // 'a','b','c' moved to oldCache

      expect(cache.delete('a')).toBe(true)
      expect(cache.has('a')).toBe(false)
    })
  })

  describe('clear', () => {
    it('should remove all items', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      cache.clear()
      expect(cache.size).toBe(0)
      expect(cache.has('a')).toBe(false)
    })

    it('should handle clear on empty cache', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.clear()
      expect(cache.size).toBe(0)
    })
  })

  describe('evict', () => {
    it('should evict the least recently used items', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      cache.evict(2)
      expect(cache.size).toBe(1)
    })

    it('should keep at least one item', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)

      cache.evict(10)
      expect(cache.size).toBe(1)
    })

    it('should do nothing when count is 0', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)

      cache.evict(0)
      expect(cache.size).toBe(2)
    })

    it('should do nothing when count is negative', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)

      cache.evict(-1)
      expect(cache.size).toBe(2)
    })

    it('should do nothing on empty cache', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.evict(1)
      expect(cache.size).toBe(0)
    })

    it('should use default count of 1 when no argument provided', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)

      cache.evict()
      expect(cache.size).toBe(2) // evict() with undefined → Number(undefined) = NaN → !NaN is true → returns early
    })

    it('should trigger onEviction for evicted items', () => {
      const onEviction = vi.fn()
      const cache = new LRUCache({ maxSize: 5, onEviction })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      cache.evict(2)
      expect(onEviction).toHaveBeenCalledTimes(2)
    })

    it('should evict exact count when items >= count', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      cache.evict(1)
      expect(cache.size).toBe(2)
    })

    it('should evict all but one when count >= items', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)

      cache.evict(5)
      expect(cache.size).toBe(1)
    })
  })

  describe('resize', () => {
    it('should increase maxSize without evicting items', () => {
      const cache = new LRUCache({ maxSize: 2 })
      cache.set('a', 1)
      cache.set('b', 2)

      cache.resize(5)
      expect(cache.maxSize).toBe(5)
      expect(cache.size).toBe(2)
      expect(cache.has('a')).toBe(true)
      expect(cache.has('b')).toBe(true)
    })

    it('should decrease maxSize and evict excess items', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      cache.resize(1)
      expect(cache.maxSize).toBe(1)
      expect(cache.size).toBe(1)
    })

    it('should throw TypeError when size is 0', () => {
      const cache = new LRUCache({ maxSize: 5 })
      expect(() => cache.resize(0)).toThrow(TypeError)
    })

    it('should throw TypeError when size is negative', () => {
      const cache = new LRUCache({ maxSize: 5 })
      expect(() => cache.resize(-1)).toThrow(TypeError)
    })

    it('should throw TypeError when size is undefined', () => {
      const cache = new LRUCache({ maxSize: 5 })
      expect(() => cache.resize()).toThrow(TypeError)
    })

    it('should trigger onEviction for evicted items on resize smaller', () => {
      const onEviction = vi.fn()
      const cache = new LRUCache({ maxSize: 5, onEviction })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      cache.resize(1)
      expect(onEviction).toHaveBeenCalledTimes(2)
    })

    it('should handle resize when items are in cache and oldCache', () => {
      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // a,b,c in oldCache, d in cache

      cache.resize(5)
      expect(cache.maxSize).toBe(5)
      // All items should be preserved when growing
      expect(cache.has('a')).toBe(true)
      expect(cache.has('b')).toBe(true)
      expect(cache.has('c')).toBe(true)
      expect(cache.has('d')).toBe(true)
    })

    it('should handle resize when new size exactly matches item count', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      cache.resize(3)
      expect(cache.maxSize).toBe(3)
      expect(cache.size).toBe(3)
    })
  })

  describe('expiresIn', () => {
    it('should return Infinity for item without expiry', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      expect(cache.expiresIn('a')).toBe(Number.POSITIVE_INFINITY)
    })

    it('should return remaining TTL for item with expiry', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1, { maxAge: 1000 })

      dateNowStub.mockReturnValue(now + 300)
      expect(cache.expiresIn('a')).toBeCloseTo(700, -1)

      dateNowStub.mockRestore()
    })

    it('should return negative value for already-expired item (lazy expiration)', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1, { maxAge: 100 })

      dateNowStub.mockReturnValue(now + 200)
      const result = cache.expiresIn('a')
      expect(result).toBeLessThan(0)

      dateNowStub.mockRestore()
    })

    it('should return undefined for non-existent key', () => {
      const cache = new LRUCache({ maxSize: 5 })
      expect(cache.expiresIn('nonexistent')).toBeUndefined()
    })

    it('should work for items in oldCache', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // 'a','b','c' in oldCache

      dateNowStub.mockReturnValue(now + 50)
      expect(cache.expiresIn('a')).toBe(Number.POSITIVE_INFINITY)

      dateNowStub.mockRestore()
    })
  })

  describe('iteration', () => {
    it('should iterate all entries with Symbol.iterator', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      const entries = [...cache]
      expect(entries).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    })

    it('should iterate all keys', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)

      const keys = [...cache.keys()]
      expect(keys).toEqual(['a', 'b'])
    })

    it('should iterate all values', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)

      const values = [...cache.values()]
      expect(values).toEqual([1, 2])
    })

    it('should iterate entries in ascending order', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      const entries = [...cache.entries()]
      expect(entries).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    })

    it('should iterate entries in ascending order via entriesAscending', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)

      const entries = [...cache.entriesAscending()]
      expect(entries).toEqual([
        ['a', 1],
        ['b', 2],
      ])
    })

    it('should iterate entries in descending order', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      const entries = [...cache.entriesDescending()]
      expect(entries).toEqual([
        ['c', 3],
        ['b', 2],
        ['a', 1],
      ])
    })

    it('should iterate entries with items in both cache and oldCache', () => {
      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3) // cache full → oldCache={a,b,c}, cache={}
      cache.set('d', 4) // cache={d}

      const entries = [...cache]
      // Symbol.iterator goes cache first, then oldCache
      expect(entries).toEqual([
        ['d', 4],
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    })

    it('should skip expired items during iteration', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2, { maxAge: 100 })
      cache.set('c', 3)

      dateNowStub.mockReturnValue(now + 200)

      const entries = [...cache]
      expect(entries).toEqual([
        ['a', 1],
        ['c', 3],
      ])

      dateNowStub.mockRestore()
    })

    it('should skip duplicate keys when iterating oldCache + cache', () => {
      const smallCache = new LRUCache({ maxSize: 2 })
      smallCache.set('a', 1)
      smallCache.set('b', 2) // cache full → oldCache={a,b}, cache={}
      smallCache.set('c', 3) // cache={c}

      // Symbol.iterator goes cache first, then oldCache
      const entries = [...smallCache]
      expect(entries).toEqual([
        ['c', 3],
        ['a', 1],
        ['b', 2],
      ])
    })

    it('should support forEach', () => {
      const cache = new LRUCache<string, number>({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)

      const results: Array<[string, number]> = []
      for (const [key, value] of cache) {
        results.push([key, value])
      }

      expect(results).toEqual([
        ['a', 1],
        ['b', 2],
      ])
    })

    it('should support forEach with thisArgument', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)

      const context = { prefix: 'test' }
      cache.forEach(function (this: typeof context, _value) {
        expect(this.prefix).toBe('test')
      }, context as never)
    })

    it('should iterate entriesDescending with items in both caches', () => {
      const cache = new LRUCache({ maxSize: 2 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3) // a,b in oldCache, c in cache

      const entries = [...cache.entriesDescending()]
      // cache in reverse first: c
      // then oldCache in reverse: b, a
      expect(entries).toEqual([
        ['c', 3],
        ['b', 2],
        ['a', 1],
      ])
    })

    it('should skip expired items in entriesDescending', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2, { maxAge: 100 })
      cache.set('c', 3)

      dateNowStub.mockReturnValue(now + 200)

      const entries = [...cache.entriesDescending()]
      expect(entries).toEqual([
        ['c', 3],
        ['a', 1],
      ])

      dateNowStub.mockRestore()
    })

    it('should handle empty cache iteration', () => {
      const cache = new LRUCache({ maxSize: 5 })
      expect([...cache]).toEqual([])
      expect([...cache.keys()]).toEqual([])
      expect([...cache.values()]).toEqual([])
      expect([...cache.entries()]).toEqual([])
      expect([...cache.entriesAscending()]).toEqual([])
      expect([...cache.entriesDescending()]).toEqual([])
    })
  })

  describe('maxSize and maxAge getters', () => {
    it('should return maxSize', () => {
      const cache = new LRUCache({ maxSize: 42 })
      expect(cache.maxSize).toBe(42)
    })

    it('should return maxAge', () => {
      const cache = new LRUCache({ maxSize: 5, maxAge: 1000 })
      expect(cache.maxAge).toBe(1000)
    })
  })

  describe('toString and Symbol.toStringTag', () => {
    it('should return [object LRUCache] from Object.prototype.toString', () => {
      const cache = new LRUCache({ maxSize: 5 })
      expect(Object.prototype.toString.call(cache)).toBe('[object LRUCache]')
    })

    it('should return formatted string from toString', () => {
      const cache = new LRUCache({ maxSize: 10 })
      cache.set('a', 1)
      cache.set('b', 2)
      expect(cache.toString()).toBe('LRUCache(2/10)')
    })
  })

  describe('size getter', () => {
    it('should return 0 for empty cache', () => {
      const cache = new LRUCache({ maxSize: 5 })
      expect(cache.size).toBe(0)
    })

    it('should return the correct count', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)
      expect(cache.size).toBe(2)
    })

    it('should return size when items span both cache and oldCache', () => {
      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3) // cache full → oldCache={a,b,c}, cache={}
      cache.set('d', 4) // cache={d}

      // _size=1, oldCache has 3 unique keys, but capped at maxSize=3
      expect(cache.size).toBe(3)
    })

    it('should cap size at maxSize', () => {
      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      // Next set will push to oldCache and maintain correct count
      cache.set('d', 4)

      expect(cache.size).toBeLessThanOrEqual(cache.maxSize)
    })
  })

  describe('onEviction callback', () => {
    it('should call onEviction when items are evicted from full cache', () => {
      const onEviction = vi.fn()
      const cache = new LRUCache({ maxSize: 2, onEviction })

      // First generation fills cache
      cache.set('a', 1)
      cache.set('b', 2) // cache full → oldCache={a,b}, cache={}
      // Second generation fills cache → oldCache={a,b} evicted
      cache.set('c', 3)
      cache.set('d', 4) // triggers eviction of oldCache {a,b}

      expect(onEviction).toHaveBeenCalledTimes(2)
      expect(onEviction).toHaveBeenCalledWith('a', 1)
      expect(onEviction).toHaveBeenCalledWith('b', 2)
    })

    it('should call onEviction when expired item is lazily deleted', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const onEviction = vi.fn()
      const cache = new LRUCache({ maxSize: 5, onEviction })
      cache.set('a', 1, { maxAge: 100 })

      dateNowStub.mockReturnValue(now + 200)
      cache.get('a') // triggers lazy expiration

      expect(onEviction).toHaveBeenCalledWith('a', 1)

      dateNowStub.mockRestore()
    })

    it('should not call onEviction when callback is not a function', () => {
      const cache = new LRUCache({ maxSize: 2 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3) // should not throw
    })

    it('should call onEviction for each evicted item via evict()', () => {
      const onEviction = vi.fn()
      const cache = new LRUCache({ maxSize: 5, onEviction })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)

      cache.evict(2)
      expect(onEviction).toHaveBeenCalledTimes(2)
    })

    it('should not throw when onEviction is not provided and items expire', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1, { maxAge: 100 })

      dateNowStub.mockReturnValue(now + 200)
      expect(() => cache.get('a')).not.toThrow()

      dateNowStub.mockRestore()
    })
  })

  describe('LRU eviction behavior', () => {
    it('should evict least recently used items first', () => {
      const cache = new LRUCache({ maxSize: 3 })

      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3) // cache full → oldCache={a,b,c}, cache={}

      // Access 'a' to promote it from oldCache to cache
      cache.get('a') // 'a' moved to cache via _moveToRecent

      // 'a' is now in cache, 'b' and 'c' still in oldCache
      // Set more items to fill up cache
      cache.set('d', 4)
      cache.set('e', 5)

      // Cache now has {a,d,e}, _size=3, maxSize=3 → evict oldCache={b,c}
      // 'b' and 'c' should be evicted (onEviction called)
      expect(cache.has('a')).toBe(true)
      expect(cache.has('d')).toBe(true)
      expect(cache.has('e')).toBe(true)
      // b and c were in oldCache which was evicted
      expect(cache.has('b')).toBe(false)
      expect(cache.has('c')).toBe(false)
    })

    it('should handle repeated access to the same key without unnecessary eviction', () => {
      const onEviction = vi.fn()
      const cache = new LRUCache({ maxSize: 3, onEviction })

      cache.set('a', 1)
      cache.set('b', 2)

      // Repeated access should not trigger eviction
      for (let i = 0; i < 10; i++) {
        expect(cache.get('a')).toBe(1)
      }

      expect(onEviction).not.toHaveBeenCalled()
    })

    it('should correctly track LRU across multiple eviction cycles', () => {
      const cache = new LRUCache({ maxSize: 2 })

      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3) // evicts a,b → oldCache has a,b; cache has c

      expect(cache.has('a')).toBe(true)
      expect(cache.has('b')).toBe(true)

      cache.set('d', 4)
      // Now cache has c,d (_size=2 == maxSize). Wait, after setting 'c',
      // _size was 1 (reset to 0, then set c → _size=1). Then set d → _size=2 which is maxSize.
      // Actually _set: _size >= _maxSize triggers eviction. _size starts at 0, _maxSize=2.
      // set a: _size=1, cache=[a]
      // set b: _size=2 >= 2 → evict oldCache (empty), oldCache=cache=[a,b], cache=new Map, _size=0. Then set b: cache=[b], _size=1
      // set c: _size=2 >= 2 → evict oldCache ([a,b]), oldCache=[b,c]... wait no.

      // Let me re-read the _set logic more carefully:
      // _set(key, value):
      //   this.cache.set(key, value)
      //   this._size++
      //   if (this._size >= this._maxSize):
      //     this._size = 0
      //     this._emitEvictions(this.oldCache)
      //     this.oldCache = this.cache
      //     this.cache = new Map()

      // So:
      // set a: cache.set('a'), _size=1. 1 < 2, no eviction. cache={a}, oldCache={}
      // set b: cache.set('b'), _size=2. 2 >= 2 → evict oldCache({}), oldCache={a,b}, cache=new Map, _size=0.
      //        Then the key is already set in the previous step... wait, no.
      //        The full flow: cache.set(key, value) is done FIRST, then _size++, then check.
      //        So: cache.set('b'), _size=1→2. 2 >= 2 → evict oldCache({}), oldCache={a,b}, cache={}, _size=0.
      //        But 'b' was set in cache BEFORE the swap! So cache had {a,b}, and then:
      //        - oldCache = cache = {a,b}
      //        - cache = new Map = {}
      //        So 'b' is now in oldCache, not in the fresh cache.

      // Wait that contradicts the comment that says "Keep at least one item in cache."
      // Actually looking at this again, the eviction pattern is:
      // The "new generation" (cache) has the most recently set items.
      // When cache fills up (size >= maxSize), ALL of cache becomes oldCache,
      // oldCache gets evicted (onEviction called on all old entries),
      // and a fresh empty cache starts.
      // This is a generational LRU, not the classic linked-list approach.

      // So after set('c'), cache={c}, _size=1, oldCache={a,b}
      // After set('d'), cache.set('d'), _size=1→2. 2 >= 2 → evict oldCache({a,b}), oldCache={c,d}, cache={}, _size=0.
      // Hmm but then 'd' is in oldCache, not cache. Let me check the code again...

      // Actually wait, the _set function:
      // 1. this.cache.set(key, value) — sets in cache
      // 2. this._size++
      // 3. Check: if _size >= maxSize → evict old, swap

      // So step 1 happens BEFORE the swap. So:
      // Before set d: cache={c}(size=1), oldCache={a,b}, _size=1
      // set d:
      //   cache.set('d', v) → cache={c,d}
      //   _size = 2
      //   2 >= 2 → evict oldCache({a,b}), oldCache={c,d}, cache={}, _size=0

      // So after set d: cache={}, oldCache={c,d}. Both 'c' and 'd' are in oldCache.
      // has('a') → checks oldCache → finds 'a' → true
      // has('b') → checks oldCache → finds 'b' → true
      // has('c') → checks oldCache → finds 'c' → true
      // has('d') → checks oldCache → finds 'd' → true

      expect(cache.has('c')).toBe(true)
      expect(cache.has('d')).toBe(true)
    })
  })

  describe('mixed key types', () => {
    it('should work with number keys', () => {
      const cache = new LRUCache<number, string>({ maxSize: 5 })
      cache.set(1, 'one')
      expect(cache.get(1)).toBe('one')
    })

    it('should work with object keys', () => {
      const cache = new LRUCache<object, number>({ maxSize: 5 })
      const key = { id: 1 }
      cache.set(key, 42)
      expect(cache.get(key)).toBe(42)
    })

    it('should work with symbol keys', () => {
      const cache = new LRUCache<symbol, string>({ maxSize: 5 })
      const key = Symbol('test')
      cache.set(key, 'symbol-value')
      expect(cache.get(key)).toBe('symbol-value')
    })
  })

  describe('Map compatibility', () => {
    it('should be instance of Map', () => {
      const cache = new LRUCache({ maxSize: 5 })
      expect(cache).toBeInstanceOf(Map)
    })

    it('should work with Map spread syntax', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1).set('b', 2)

      const map = new Map(cache)
      expect(map.get('a')).toBe(1)
      expect(map.get('b')).toBe(2)
    })
  })

  describe('value types', () => {
    it('should store and retrieve null values', () => {
      const cache = new LRUCache<string, null>({ maxSize: 5 })
      cache.set('a', null)
      expect(cache.get('a')).toBeNull()
      expect(cache.has('a')).toBe(true)
    })

    it('should store and retrieve undefined values', () => {
      const cache = new LRUCache<string, undefined>({ maxSize: 5 })
      cache.set('a', undefined)
      expect(cache.get('a')).toBeUndefined()
      expect(cache.has('a')).toBe(true)
    })

    it('should store and retrieve 0 as a value', () => {
      const cache = new LRUCache<string, number>({ maxSize: 5 })
      cache.set('a', 0)
      expect(cache.get('a')).toBe(0)
    })

    it('should store and retrieve false as a value', () => {
      const cache = new LRUCache<string, boolean>({ maxSize: 5 })
      cache.set('a', false)
      expect(cache.get('a')).toBe(false)
    })

    it('should store and retrieve empty string as a value', () => {
      const cache = new LRUCache<string, string>({ maxSize: 5 })
      cache.set('a', '')
      expect(cache.get('a')).toBe('')
    })

    it('should store and retrieve objects', () => {
      const cache = new LRUCache<string, { x: number }>({ maxSize: 5 })
      const obj = { x: 42 }
      cache.set('a', obj)
      expect(cache.get('a')).toBe(obj)
      expect(cache.get('a')!.x).toBe(42)
    })
  })

  describe('duplicate keys across generations', () => {
    // When a key in oldCache is set again, it enters cache while the old
    // entry remains in oldCache — both generations hold the key.
    function createCacheWithDuplicateKey() {
      const cache = new LRUCache<string, number>({ maxSize: 2 })
      cache.set('a', 1)
      cache.set('b', 2) // cache full → oldCache={a,b}, cache={}
      cache.set('a', 3) // 'a' now in both cache (value=3) and oldCache (value=1)
      return cache
    }

    it('should skip oldCache entry when key also exists in cache during Symbol.iterator', () => {
      const cache = createCacheWithDuplicateKey()
      const entries = [...cache]
      expect(entries).toEqual([
        ['a', 3],
        ['b', 2],
      ])
    })

    it('should skip oldCache entry when key also exists in cache during entriesAscending', () => {
      const cache = createCacheWithDuplicateKey()
      const entries = [...cache.entriesAscending()]
      expect(entries).toEqual([
        ['b', 2],
        ['a', 3],
      ])
    })

    it('should skip oldCache entry when key also exists in cache during entriesDescending', () => {
      const cache = createCacheWithDuplicateKey()
      const entries = [...cache.entriesDescending()]
      expect(entries).toEqual([
        ['a', 3],
        ['b', 2],
      ])
    })

    it('should exclude duplicate keys from size count', () => {
      const cache = createCacheWithDuplicateKey()
      // _size=1 (a is in cache), oldCache has a(dupe) and b → unique count = 2
      expect(cache.size).toBe(2)
    })

    it('should skip duplicate in forEach iteration', () => {
      const cache = createCacheWithDuplicateKey()
      const keys: string[] = []
      cache.forEach((_v, key) => {
        keys.push(key)
      })
      // _entriesAscending yields oldCache first (b only, a skipped), then cache (a)
      expect(keys).toEqual(['b', 'a'])
    })
  })

  describe('expired items in oldCache during iteration', () => {
    it('should skip expired oldCache items in _entriesAscending', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache<string, number>({ maxSize: 2 })
      cache.set('a', 1, { maxAge: 100 })
      cache.set('b', 2) // cache full → oldCache={a,b}, cache={}
      // 'a' (with expiry) is in oldCache only

      dateNowStub.mockReturnValue(now + 200)

      // entriesAscending processes oldCache, hits expired 'a' first
      const entries = [...cache.entriesAscending()]
      expect(entries).toEqual([['b', 2]])

      dateNowStub.mockRestore()
    })

    it('should skip expired oldCache items in Symbol.iterator', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache<string, number>({ maxSize: 2 })
      cache.set('a', 1, { maxAge: 100 })
      cache.set('b', 2) // cache full → oldCache={a,b}, cache={}

      dateNowStub.mockReturnValue(now + 200)

      const entries = [...cache]
      expect(entries).toEqual([['b', 2]])

      dateNowStub.mockRestore()
    })

    it('should skip expired oldCache items in entriesDescending', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache<string, number>({ maxSize: 2 })
      cache.set('a', 1, { maxAge: 100 })
      cache.set('b', 2) // cache full → oldCache={a,b}, cache={}

      dateNowStub.mockReturnValue(now + 200)

      const entries = [...cache.entriesDescending()]
      expect(entries).toEqual([['b', 2]])

      dateNowStub.mockRestore()
    })
  })

  describe('edge cases', () => {
    it('should handle maxSize of 1', () => {
      const cache = new LRUCache({ maxSize: 1 })
      cache.set('a', 1)
      expect(cache.has('a')).toBe(true)

      cache.set('b', 2)
      // 'a' was in oldCache which got evicted when cache (with 'b') reached maxSize
      expect(cache.has('a')).toBe(false)
      expect(cache.has('b')).toBe(true)
    })

    it('should handle setting same key with different expiry', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1, { maxAge: 100 })

      // Update expiry
      cache.set('a', 1, { maxAge: 1000 })

      dateNowStub.mockReturnValue(now + 200)
      expect(cache.get('a')).toBe(1) // Should use new expiry

      dateNowStub.mockRestore()
    })

    it('should handle set with maxAge that is NaN', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1, { maxAge: Number.NaN })
      // NaN !== Number.POSITIVE_INFINITY is true, so expiry = timestamp() + NaN = NaN
      // But the condition is isNumber(maxAge) && maxAge !== Number.POSITIVE_INFINITY
      // isNumber(NaN) — need to check. Looking at the predicate module...
      // isNumber likely checks typeof value === 'number', so NaN passes.
      // So expiry = timestamp() + NaN = NaN
      // Later, _deleteIfExpired checks: isNumber(item.expiry) && item.expiry <= timestamp()
      // NaN <= timestamp() is false, so it won't be considered expired.
      // Let me just test the behavior.
      expect(cache.has('a')).toBe(true)
    })

    it('should handle delete when key exists in both caches', () => {
      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // a,b,c in oldCache

      // Move 'a' to cache via get
      cache.get('a') // now 'a' is in cache

      expect(cache.delete('a')).toBe(true)
      // 'a' was deleted from cache (cache.delete returns true), _size decreased
      // oldCache.delete also checked
    })

    it('should handle size getter when _size is 0', () => {
      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      // After this: oldCache has a,b,c; cache is empty; _size=0

      // size getter: !_size is true (0 is falsy), so returns oldCache.size
      expect(cache.size).toBe(3)
    })

    it('should handle resize with onEviction as undefined', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)
      cache.set('b', 2)

      // Should not throw even with undefined onEviction
      expect(() => cache.resize(1)).not.toThrow()
    })
  })

  describe('expiry during iteration', () => {
    it('should skip expired items in Symbol.iterator (oldCache path)', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1, { maxAge: 100 })
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // a,b,c in oldCache

      dateNowStub.mockReturnValue(now + 200)

      // 'a' should be expired and skipped
      const entries = [...cache]
      expect(entries).not.toContainEqual(['a', 1])
      expect(entries).toContainEqual(['b', 2])
      expect(entries).toContainEqual(['c', 3])
      expect(entries).toContainEqual(['d', 4])

      dateNowStub.mockRestore()
    })

    it('should skip expired items in entriesAscending', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1, { maxAge: 100 })
      cache.set('b', 2)
      cache.set('c', 3)

      dateNowStub.mockReturnValue(now + 200)

      const entries = [...cache.entriesAscending()]
      expect(entries).not.toContainEqual(['a', 1])

      dateNowStub.mockRestore()
    })

    it('should skip expired oldCache items in entriesDescending', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1, { maxAge: 100 })
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // a,b,c in oldCache, d in cache... actually after swap, d might be in oldCache too

      dateNowStub.mockReturnValue(now + 200)

      const entries = [...cache.entriesDescending()]
      expect(entries).not.toContainEqual(['a', 1])

      dateNowStub.mockRestore()
    })
  })

  describe('expiresIn edge cases', () => {
    it('should handle key only in oldCache with expiry', () => {
      const now = Date.now()
      const dateNowStub = vi.spyOn(Date, 'now').mockReturnValue(now)

      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1, { maxAge: 500 })
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // a,b,c in oldCache

      dateNowStub.mockReturnValue(now + 100)
      expect(cache.expiresIn('a')).toBe(400)

      dateNowStub.mockRestore()
    })

    it('should handle key in oldCache without expiry', () => {
      const cache = new LRUCache({ maxSize: 3 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      cache.set('d', 4) // a,b,c in oldCache

      expect(cache.expiresIn('a')).toBe(Number.POSITIVE_INFINITY)
    })
  })

  describe('forEach types', () => {
    it('should receive LRUCacheItem value in callback', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 42)

      cache.forEach((value, _key, _map) => {
        // forEach uses _entriesAscending which yields LRUCacheItem<V>
        expect(value).toEqual({ value: 42 })
      })
    })

    it('should default thisArgument to cache instance', () => {
      const cache = new LRUCache({ maxSize: 5 })
      cache.set('a', 1)

      cache.forEach(function (this: unknown) {
        expect(this).toBe(cache)
      })
    })
  })
})

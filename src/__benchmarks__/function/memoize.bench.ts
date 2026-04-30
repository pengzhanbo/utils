import { describe, bench } from 'vitest'
import { memoize } from '../../function/memoize'

describe('Performance > Function > Memoize', () => {
  // M-01: Small cache with high-frequency access / 小缓存高频访问
  bench(
    'Cache hit | maxSize=10, 1000 calls with 5 unique keys',
    () => {
      const fn = (x: number) => x * 2
      const memoized = memoize(fn, { maxSize: 10 })

      for (let i = 0; i < 1000; i++) {
        memoized(i % 5) // Only 5 unique keys, high cache hit rate
      }
    },
    { time: 2000, iterations: 100 },
  )

  // M-02: Large cache normal access / 大缓存正常访问
  bench(
    'Normal access | maxSize=1000, 5000 calls with 500 unique keys',
    () => {
      const fn = (x: number) => x * 2
      const memoized = memoize(fn, { maxSize: 1000 })

      for (let i = 0; i < 5000; i++) {
        memoized(i % 500)
      }
    },
    { time: 2000, iterations: 50 },
  )

  // M-03: LRU eviction pressure test / LRU淘汰压力测试（验证O(1)优化效果）
  bench(
    'LRU eviction pressure | maxSize=100, 20000 unique keys (forces eviction)',
    () => {
      const fn = (x: number) => x * 2
      const memoized = memoize(fn, { maxSize: 100 })

      // Access 20000 different keys to trigger frequent LRU eviction
      for (let i = 0; i < 20000; i++) {
        memoized(i)
      }
    },
    { time: 3000, iterations: 30 },
  )

  // M-04: TTL expiration overhead / TTL过期机制开销
  bench(
    'TTL expiration | ttl=100ms, 1000 calls',
    () => {
      const fn = (x: number) => {
        return x * 3
      }

      const memoized = memoize(fn, { maxSize: 50, ttl: 100 })

      for (let i = 0; i < 1000; i++) {
        memoized(i % 20)
      }
    },
    { time: 2000, iterations: 100 },
  )

  // M-05: Custom keyResolver overhead / 自定义key生成器开销
  bench(
    'Custom keyResolver | complex key generation',
    () => {
      const fn = (obj: { a: number; b: string }) => obj.a * 2
      const memoized = memoize(fn, {
        maxSize: 100,
        keyResolver: (obj) => `${obj.a}_${obj.b}`,
      })

      for (let i = 0; i < 1000; i++) {
        memoized({ a: i % 50, b: `key_${i % 10}` })
      }
    },
    { time: 2000, iterations: 100 },
  )

  // M-06: No cache baseline comparison / 无缓存基线对比
  bench(
    'No cache baseline | raw function, 10000 calls',
    () => {
      const fn = (x: number) => x * 2

      for (let i = 0; i < 10000; i++) {
        fn(i)
      }
    },
    { time: 2000, iterations: 100 },
  )

  // Additional: Edge case - maxSize=0 (always evict) / 边界情况：maxSize=0
  bench(
    'Edge case | maxSize=0 (always evict), 1000 calls',
    () => {
      const fn = (x: number) => x * 2
      const memoized = memoize(fn, { maxSize: 0 })

      for (let i = 0; i < 1000; i++) {
        memoized(i)
      }
    },
    { time: 2000, iterations: 100 },
  )
})

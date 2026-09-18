import { describe, it } from 'vitest'
import { memoize } from '../../function/memoize.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Function > Memoize', () => {
  // M-01 + M-04 + M-07: Same 1000-call scale, so they share one comparison table
  // M-01 + M-04 + M-07: 同为 1000 次调用规模，放在同一张对比表中
  it('1000 calls, cache variants', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        // M-01: Small cache with high-frequency access / 小缓存高频访问
        bench('cache hit', () => {
          const fn = (x: number): number => x * 2
          const memoized = memoize(fn, { maxSize: 10 })

          let result = 0
          for (let i = 0; i < 1000; i++) {
            result = memoized(i % 5)
          } // Only 5 unique keys, high cache hit rate
          return result
        }),
        // M-04: TTL expiration overhead / TTL过期机制开销
        bench('tTL expiration', () => {
          const fn = (x: number): number => x * 3

          const memoized = memoize(fn, { maxSize: 50, ttl: 100 })

          let result = 0
          for (let i = 0; i < 1000; i++) {
            result = memoized(i % 20)
          }
          return result
        }),
        // Additional: Edge case - maxSize=0 (always evict) / 边界情况：maxSize=0
        bench('edge case', () => {
          const fn = (x: number): number => x * 2
          const memoized = memoize(fn, { maxSize: 0 })

          let result = 0
          for (let i = 0; i < 1000; i++) {
            result = memoized(i)
          }
          return result
        }),
      ],
      { time: 2000, iterations: 100 },
    )
  })

  // M-02: Large cache normal access / 大缓存正常访问
  it('5000 calls, normal access', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('normal access', () => {
          const fn = (x: number): number => x * 2
          const memoized = memoize(fn, { maxSize: 1000 })

          let result = 0
          for (let i = 0; i < 5000; i++) {
            result = memoized(i % 500)
          }
          return result
        }),
      ],
      { time: 2000, iterations: 50 },
    )
  })

  // M-03: LRU eviction pressure test / LRU淘汰压力测试（验证O(1)优化效果）
  it('lru eviction pressure', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('lRU eviction pressure', () => {
          const fn = (x: number): number => x * 2
          const memoized = memoize(fn, { maxSize: 100 })

          // Access 20000 different keys to trigger frequent LRU eviction
          let result = 0
          for (let i = 0; i < 20000; i++) {
            result = memoized(i)
          }
          return result
        }),
      ],
      { time: 3000, iterations: 30 },
    )
  })

  // M-05: Custom keyResolver overhead / 自定义key生成器开销
  it('custom key resolver', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('custom keyResolver', () => {
          const fn = (obj: { a: number; b: string }): number => obj.a * 2
          const memoized = memoize(fn, {
            maxSize: 100,
            keyResolver: (obj) => `${obj.a}_${obj.b}`,
          })

          let result = 0
          for (let i = 0; i < 1000; i++) {
            result = memoized({ a: i % 50, b: `key_${i % 10}` })
          }
          return result
        }),
      ],
      { time: 2000, iterations: 100 },
    )
  })

  // M-06: No cache baseline comparison / 无缓存基线对比
  it('no cache baseline', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('no cache baseline', () => {
          const fn = (x: number): number => x * 2

          let result = 0
          for (let i = 0; i < 10000; i++) {
            result = fn(i)
          }
          return result
        }),
      ],
      { time: 2000, iterations: 100 },
    )
  })
})

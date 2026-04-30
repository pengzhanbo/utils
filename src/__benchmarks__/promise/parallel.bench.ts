import { describe, bench } from 'vitest'
import { promiseParallel, promiseParallelSettled } from '../../promise/parallel'

describe('Performance > Promise > Parallel', () => {
  // PL-01: Small batch parallel / 小批量并行
  bench(
    'promiseParallel | 10 promises, unlimited concurrency',
    async () => {
      const promises = Array.from({ length: 10 }, (_, i) => Promise.resolve(i * 2))
      await promiseParallel(promises)
    },
    { time: 2000, iterations: 200 },
  )

  // PL-02: Medium batch parallel / 中批量并行
  bench(
    'promiseParallel | 100 promises, concurrency=10',
    async () => {
      const promises = Array.from({ length: 100 }, (_, i) => Promise.resolve(i))
      await promiseParallel(promises, 10)
    },
    { time: 2000, iterations: 100 },
  )

  // PL-03: Large batch with limited concurrency / 大批量限制并发
  bench(
    'promiseParallel | 500 promises, concurrency=5',
    async () => {
      const promises = Array.from({ length: 500 }, (_, i) => Promise.resolve(i))
      await promiseParallel(promises, 5)
    },
    { time: 3000, iterations: 50 },
  )

  // PL-04: Function-based promises / 函数式Promise
  bench(
    'promiseParallel | function factories (100 items)',
    async () => {
      const factories = Array.from({ length: 100 }, (_, i) => () => Promise.resolve(i))
      await promiseParallel(factories, 10)
    },
    { time: 2000, iterations: 100 },
  )

  // PL-05: Settled mode (handles rejections) / settled模式（处理拒绝）
  bench(
    'promiseParallelSettled | mixed results (100 items)',
    async () => {
      const promises = Array.from({ length: 100 }, (_, i) =>
        i % 3 === 0 ? Promise.reject(new Error(`err_${i}`)) : Promise.resolve(i),
      )
      await promiseParallelSettled(promises, 10)
    },
    { time: 2000, iterations: 100 },
  )

  // PL-06: vs Promise.all baseline / 与Promise.all对比
  bench(
    'Promise.all baseline | 100 promises',
    async () => {
      const promises = Array.from({ length: 100 }, (_, i) => Promise.resolve(i))
      await Promise.all(promises)
    },
    { time: 2000, iterations: 100 },
  )

  // PL-07: vs Promise.allSettled baseline / 与Promise.allSettled对比
  bench(
    'Promise.allSettled baseline | 100 promises',
    async () => {
      const promises = Array.from({ length: 100 }, (_, i) => Promise.resolve(i))
      await Promise.allSettled(promises)
    },
    { time: 2000, iterations: 100 },
  )
})

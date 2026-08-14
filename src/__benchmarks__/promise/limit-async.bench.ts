import { bench, describe } from 'vitest'
import { limitAsync } from '../../promise/limit-async.js'
import { promiseParallel } from '../../promise/parallel.js'

describe('performance > Promise > LimitAsync', () => {
  // LA-01: Call-site limiter, 100 calls with concurrency=10 / 调用点限流器，100次调用，并发10
  bench(
    'limitAsync + Promise.all | 100 calls, concurrency=10',
    async () => {
      const limited = limitAsync(async (i: number) => i, 10)
      const calls = Array.from({ length: 100 }, (_, i) => limited(i))
      await Promise.all(calls)
    },
    { time: 2000, iterations: 100 },
  )

  // LA-02: vs promiseParallel on the same batch / 与 promiseParallel 同批量对比
  bench(
    'promiseParallel | 100 factories, concurrency=10',
    async () => {
      const factories = Array.from({ length: 100 }, (_, i) => async () => i)
      await promiseParallel(factories, 10)
    },
    { time: 2000, iterations: 100 },
  )

  // LA-03: vs Promise.all baseline / 与 Promise.all 基线对比
  bench(
    'promise.all baseline | 100 promises',
    async () => {
      const promises = Array.from({ length: 100 }, async (_, i) => i)
      await Promise.all(promises)
    },
    { time: 2000, iterations: 100 },
  )
})

import { describe, it } from 'vitest'
import { limitAsync } from '../../promise/limit-async.js'
import { promiseParallel } from '../../promise/parallel.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Promise > LimitAsync', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const factories100 = Array.from({ length: 100 }, (_, i) => async () => i)
  const promises100 = Array.from({ length: 100 }, async (_, i) => i)

  // LA-01 ~ LA-03: Same 100-call scale, so they share one comparison table
  // LA-01 ~ LA-03: 同为 100 次调用规模，放在同一张对比表中
  it('100 calls, concurrency=10', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        // LA-01: Call-site limiter, 100 calls with concurrency=10 / 调用点限流器，100次调用，并发10
        bench('limitAsync + Promise.all', async () => {
          const limited = limitAsync(async (i: number) => i, 10)
          const calls = Array.from({ length: 100 }, (_, i) => limited(i))
          return Promise.all(calls)
        }),
        // LA-02: vs promiseParallel on the same batch / 与 promiseParallel 同批量对比
        bench('promiseParallel', () => promiseParallel(factories100, 10)),
        // LA-03: vs Promise.all baseline / 与 Promise.all 基线对比
        bench('promise.all baseline', () => Promise.all(promises100)),
      ],
      { time: 2000, iterations: 100 },
    )
  })
})

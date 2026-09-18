import { describe, it } from 'vitest'
import { promiseParallel, promiseParallelSettled } from '../../promise/parallel.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Promise > Parallel', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const promises10 = Array.from({ length: 10 }, async (_, i) => i * 2)
  const promises100 = Array.from({ length: 100 }, async (_, i) => i)
  const promises500 = Array.from({ length: 500 }, async (_, i) => i)
  const factories100 = Array.from({ length: 100 }, (_, i) => async () => i)

  // PL-01: Small batch parallel / 小批量并行
  it('10 promises, unlimited concurrency', async ({ bench }) => {
    await runBenchmarks(bench, [bench('promiseParallel', () => promiseParallel(promises10))], {
      time: 2000,
      iterations: 200,
    })
  })

  // PL-02 + PL-06: Same 100-promise scale, compared with the Promise.all baseline
  // PL-02 + PL-06: 同为 100 promise 规模，与 Promise.all 基线对比
  it('100 promises, concurrency=10', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        // PL-02: Medium batch parallel / 中批量并行
        bench('promiseParallel', () => promiseParallel(promises100, 10)),
        // PL-06: vs Promise.all baseline / 与Promise.all对比
        bench('promise.all baseline', () => Promise.all(promises100)),
      ],
      { time: 2000, iterations: 100 },
    )
  })

  // PL-03: Large batch with limited concurrency / 大批量限制并发
  it('500 promises, concurrency=5', async ({ bench }) => {
    await runBenchmarks(bench, [bench('promiseParallel', () => promiseParallel(promises500, 5))], {
      time: 3000,
      iterations: 50,
    })
  })

  // PL-04: Function-based promises / 函数式Promise
  it('100 factories, concurrency=10', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [bench('promiseParallel', () => promiseParallel(factories100, 10))],
      { time: 2000, iterations: 100 },
    )
  })

  // PL-05 + PL-07: Settled mode compared with the Promise.allSettled baseline
  // PL-05 + PL-07: settled 模式与 Promise.allSettled 基线对比
  it('100 promises, settled results', async ({ bench }) => {
    // Built once per test run (not per iteration) so the rejected promises are handled
    // immediately; pre-allocating them at `describe` scope would leak unhandled rejections.
    // 每次测试运行只构造一份（而非每次迭代），使被拒绝的 promise 立即被消费；
    // 放在 describe 作用域预分配会触发 unhandled rejection 告警
    const settledInput = Array.from({ length: 100 }, (_, i) =>
      i % 3 === 0 ? Promise.reject(new Error(`err_${i}`)) : Promise.resolve(i),
    )
    await runBenchmarks(
      bench,
      [
        // PL-05: Settled mode (handles rejections) / settled模式（处理拒绝）
        bench('promiseParallelSettled', () => promiseParallelSettled(settledInput, 10)),
        // PL-07: vs Promise.allSettled baseline / 与Promise.allSettled对比
        bench('promise.allSettled baseline', () => Promise.allSettled(settledInput)),
      ],
      { time: 2000, iterations: 100 },
    )
  })
})

import { describe, it } from 'vitest'
import { partition } from '../../array/partition.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Array > Partition', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const numbers100 = Array.from({ length: 100 }, (_, i) => i)
  const numbers10k = Array.from({ length: 10000 }, (_, i) => i)
  const numbers100k = Array.from({ length: 100000 }, (_, i) => i)
  const objects10k = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `item_${i}`,
    score: Math.floor(Math.random() * 100),
    active: i % 3 !== 0,
  }))
  const strings10k = Array.from({ length: 10000 }, (_, i) => 'x'.repeat((i % 10) + 1))

  // PT-01: Small array / 小数组
  it('small array (100 items)', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [bench('partition', () => partition(numbers100, (item) => item % 2 === 0))],
      { time: 1000, iterations: 500 },
    )
  })

  // PT-02 + PT-06: Same 10K scale and run options, so they share one comparison table
  // PT-02 + PT-06: 同为 10K 规模且运行参数相同，放在同一张对比表中
  it('10K items, partition vs filter×2', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('partition', () => partition(numbers10k, (item) => item % 2 === 0)),
        bench('filter×2 baseline', () => {
          const pass = numbers10k.filter((item) => item % 2 === 0)
          const fail = numbers10k.filter((item) => item % 2 !== 0)
          return pass.length + fail.length
        }),
      ],
      { time: 1000, iterations: 200 },
    )
  })

  // PT-03: Large array / 大型数组
  it('large array (100K items)', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [bench('partition', () => partition(numbers100k, (item) => item < 50000))],
      { time: 2000, iterations: 50 },
    )
  })

  // PT-04: Complex predicate / 复杂谓词
  it('10K items, complex predicate', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [bench('partition', () => partition(objects10k, (item) => item.active && item.score >= 50))],
      { time: 1000, iterations: 100 },
    )
  })

  // PT-05: String predicates / 字符串谓词
  it('10K items, string length check', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [bench('partition', () => partition(strings10k, (item) => item.length > 5))],
      { time: 1000, iterations: 100 },
    )
  })
})

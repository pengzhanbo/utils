import { describe, it } from 'vitest'
import { maxBy } from '../../array/max-by.js'
import { minBy } from '../../array/min-by.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Array > MinMaxBy', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const numbers10k = Array.from({ length: 10000 }, (_, i) => i)
  const strings10k = Array.from({ length: 10000 }, (_, i) => `item_${i}`)
  const objects10k = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    score: Math.floor(Math.random() * 100),
  }))

  // MM-01 ~ MM-02: Same 10K scale and run options, so they share one comparison table
  // MM-01 ~ MM-02: 同为 10K 规模且运行参数相同，放在同一张对比表中
  it('10K items, numbers', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('minBy', () => minBy(numbers10k, (item) => item)),
        bench('maxBy', () => maxBy(numbers10k, (item) => item)),
      ],
      { time: 1000, iterations: 200 },
    )
  })

  // MM-03 ~ MM-04: Same 10K scale and run options, so they share one comparison table
  // MM-03 ~ MM-04: 同为 10K 规模且运行参数相同，放在同一张对比表中
  it('10K items, strings', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('minBy', () => minBy(strings10k, (item) => item)),
        bench('maxBy', () => maxBy(strings10k, (item) => item)),
      ],
      { time: 1000, iterations: 200 },
    )
  })

  // MM-05 ~ MM-06: Same 10K scale and run options, so they share one comparison table
  // MM-05 ~ MM-06: 同为 10K 规模且运行参数相同，放在同一张对比表中
  it('10K items, objects', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('minBy', () => minBy(objects10k, (item) => item.score)),
        bench('maxBy', () => maxBy(objects10k, (item) => item.score)),
      ],
      { time: 1000, iterations: 100 },
    )
  })
})

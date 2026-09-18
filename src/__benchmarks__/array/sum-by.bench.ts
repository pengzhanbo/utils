import { describe, it } from 'vitest'
import { sumBy } from '../../array/sum-by.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Array > SumBy', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const smallArray = Array.from({ length: 100 }, (_, i) => i)
  const mediumArray = Array.from({ length: 10000 }, (_, i) => i)
  const largeArray = Array.from({ length: 100000 }, (_, i) => i)

  // SM-01: Small array / 小数组
  it('small array (100 items)', async ({ bench }) => {
    await runBenchmarks(bench, [bench('sumBy', () => sumBy(smallArray, (item) => item))], {
      time: 1000,
      iterations: 500,
    })
  })

  // SM-02 + SM-04: Same 10K scale and run options, so they share one comparison table
  // SM-02 + SM-04: 同为 10K 规模且运行参数相同，放在同一张对比表中
  it('10K items, sumBy vs reduce', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('sumBy', () => sumBy(mediumArray, (item) => item)),
        bench('reduce baseline', () => mediumArray.reduce((acc, item) => acc + item, 0)),
      ],
      { time: 1000, iterations: 200 },
    )
  })

  // SM-03: Large array / 大型数组
  it('large array (100K items)', async ({ bench }) => {
    await runBenchmarks(bench, [bench('sumBy', () => sumBy(largeArray, (item) => item))], {
      time: 2000,
      iterations: 50,
    })
  })
})

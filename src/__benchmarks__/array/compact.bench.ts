import { describe, it } from 'vitest'
import { compact } from '../../array/compact.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Array > Compact', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const smallArray: (number | null | undefined)[] = Array.from({ length: 100 }, (_, i) =>
    i % 2 === 0 ? i : null,
  )
  const mediumArray: (number | null | undefined)[] = Array.from({ length: 10000 }, (_, i) =>
    i % 2 === 0 ? i : null,
  )
  const largeArray: (number | null | undefined)[] = Array.from({ length: 100000 }, (_, i) =>
    i % 2 === 0 ? i : null,
  )

  // CT-01: Small array / 小数组
  it('small array (100 items)', async ({ bench }) => {
    await runBenchmarks(bench, [bench('compact', () => compact(smallArray))], {
      time: 1000,
      iterations: 500,
    })
  })

  // CT-02 + CT-04: Same 10K scale and run options, so they share one comparison table
  // CT-02 + CT-04: 同为 10K 规模且运行参数相同，放在同一张对比表中
  it('10K items, compact vs filter(Boolean)', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('compact', () => compact(mediumArray)),
        bench('filter(Boolean) baseline', () => mediumArray.filter(Boolean)),
      ],
      { time: 1000, iterations: 200 },
    )
  })

  // CT-03: Large array / 大型数组
  it('large array (100K items)', async ({ bench }) => {
    await runBenchmarks(bench, [bench('compact', () => compact(largeArray))], {
      time: 2000,
      iterations: 50,
    })
  })
})

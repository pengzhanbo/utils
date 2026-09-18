import { describe, it } from 'vitest'
import { deepFlatten } from '../../array/deep-flatten.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Array > DeepFlatten', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const flatArray = Array.from({ length: 10000 }, (_, i) => i)
  const nestedArray: any[] = (() => {
    let arr: any[] = Array.from({ length: 10000 }, (_, i) => i)
    for (let i = 0; i < 5; i++) {
      arr = [arr]
    }
    return arr
  })()
  const mixedArray = Array.from({ length: 10000 }, (_, i) => (i % 2 === 0 ? i : [i]))

  // DF-01 + DF-04: Same 10K leaves scale and run options, so they share one comparison table
  // DF-01 + DF-04: 同为 10K 叶子节点规模且运行参数相同，放在同一张对比表中
  it('10K leaves, 5-level nesting', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('deepFlatten', () => deepFlatten(nestedArray)),
        bench('flat(Infinity) baseline', () => nestedArray.flat(Infinity)),
      ],
      { time: 1000, iterations: 50 },
    )
  })

  // DF-02: Shallow mixed / 浅层混合
  it('10K items, 2-level nesting', async ({ bench }) => {
    await runBenchmarks(bench, [bench('deepFlatten', () => deepFlatten(mixedArray))], {
      time: 1000,
      iterations: 100,
    })
  })

  // DF-03: Already flat / 已扁平
  it('10K items, flat array', async ({ bench }) => {
    await runBenchmarks(bench, [bench('deepFlatten', () => deepFlatten(flatArray))], {
      time: 1000,
      iterations: 200,
    })
  })
})

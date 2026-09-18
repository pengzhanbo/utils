import { describe, it } from 'vitest'
import { uniq, uniqBy, uniqWith } from '../../array/uniq.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Array > Uniq', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const smallArray = Array.from({ length: 100 }, (_, i) => i % 50)
  const mediumArray = Array.from({ length: 10000 }, (_, i) => i % 2000)
  const largeArray = Array.from({ length: 100000 }, (_, i) => i % 10000)
  const uniqueArray = Array.from({ length: 100000 }, (_, i) => i)
  const duplicateArray = Array.from({ length: 100000 }, () => 42)
  const objectArray = Array.from({ length: 10000 }, (_, i) => ({
    id: Math.floor(i / 3),
    name: `item_${i}`,
    value: i,
  }))
  const floatArray = Array.from({ length: 10000 }, (_, i) => i * 0.5)
  const recordArray = Array.from({ length: 1000 }, (_, i) => ({
    x: Math.floor(i / 5),
    y: i,
  }))

  // UQ-01: Small array with many duplicates / 小数组多重复
  it('small array, 50% duplicates', async ({ bench }) => {
    await runBenchmarks(bench, [bench('uniq', () => uniq(smallArray))], {
      time: 1000,
      iterations: 500,
    })
  })

  // UQ-02: Medium array / 中型数组
  it('medium array, 20% duplicates', async ({ bench }) => {
    await runBenchmarks(bench, [bench('uniq', () => uniq(mediumArray))], {
      time: 1000,
      iterations: 200,
    })
  })

  // UQ-03 ~ UQ-04 + UQ-09: Same 100K scale, so they share one comparison table
  // UQ-03 ~ UQ-04 + UQ-09: 同为 100K 规模，放在同一张对比表中
  it('100K items', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('uniq (10% duplicates)', () => uniq(largeArray)),
        bench('uniq (no duplicates)', () => uniq(uniqueArray)),
        bench('manual Set', () => Array.from(new Set(largeArray))),
      ],
      { time: 2000, iterations: 50 },
    )
  })

  // UQ-05: All duplicates (best case) / 全部重复（最佳情况）
  it('all duplicates, 100K items', async ({ bench }) => {
    await runBenchmarks(bench, [bench('uniq', () => uniq(duplicateArray))], {
      time: 1000,
      iterations: 100,
    })
  })

  // UQ-06 ~ UQ-07: uniqBy variants on the same 10K scale / 同规模 uniqBy 变体
  it('uniqBy, 10K items', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('uniqBy (id field)', () => uniqBy(objectArray, (item) => item.id)),
        bench('uniqBy (computed key)', () => uniqBy(floatArray, Math.floor)),
      ],
      { time: 1000, iterations: 100 },
    )
  })

  // UQ-08: uniqWith custom comparator / 自定义比较器
  it('uniqWith, 1K items', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [bench('uniqWith', () => uniqWith(recordArray, (a, b) => a.x === b.x))],
      { time: 1000, iterations: 100 },
    )
  })
})

import { describe, bench } from 'vitest'
import { sumBy } from '../../array/sum-by'

describe('Performance > Array > SumBy', () => {
  // SM-01: Small array / 小数组
  bench(
    'sumBy | small array (100 items)',
    () => {
      const arr = Array.from({ length: 100 }, (_, i) => i)
      sumBy(arr, (n) => n)
    },
    { time: 1000, iterations: 500 },
  )

  // SM-02: Medium array / 中型数组
  bench(
    'sumBy | medium array (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i)
      sumBy(arr, (n) => n)
    },
    { time: 1000, iterations: 200 },
  )

  // SM-03: Large array / 大型数组
  bench(
    'sumBy | large array (100K items)',
    () => {
      const arr = Array.from({ length: 100000 }, (_, i) => i)
      sumBy(arr, (n) => n)
    },
    { time: 2000, iterations: 50 },
  )

  // SM-04: vs reduce baseline / 与 reduce 对比
  bench(
    'reduce baseline | 10K items',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i)
      arr.reduce((acc, n) => acc + n, 0)
    },
    { time: 1000, iterations: 200 },
  )
})

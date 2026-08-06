import { describe, bench } from 'vitest'
import { compact } from '../../array/compact.js'

describe('performance > Array > Compact', () => {
  // CT-01: Small array / 小数组
  bench(
    'compact | small array (100 items, 50% falsy)',
    () => {
      const arr: (number | null | undefined)[] = Array.from({ length: 100 }, (_, i) =>
        i % 2 === 0 ? i : null,
      )
      compact(arr)
    },
    { time: 1000, iterations: 500 },
  )

  // CT-02: Medium array / 中型数组
  bench(
    'compact | medium array (10K items, 50% falsy)',
    () => {
      const arr: (number | null | undefined)[] = Array.from({ length: 10000 }, (_, i) =>
        i % 2 === 0 ? i : null,
      )
      compact(arr)
    },
    { time: 1000, iterations: 200 },
  )

  // CT-03: Large array / 大型数组
  bench(
    'compact | large array (100K items, 50% falsy)',
    () => {
      const arr: (number | null | undefined)[] = Array.from({ length: 100000 }, (_, i) =>
        i % 2 === 0 ? i : null,
      )
      compact(arr)
    },
    { time: 2000, iterations: 50 },
  )

  // CT-04: vs filter(Boolean) baseline / 与 filter(Boolean) 对比
  bench(
    'filter(Boolean) baseline | 10K items',
    () => {
      const arr: (number | null | undefined)[] = Array.from({ length: 10000 }, (_, i) =>
        i % 2 === 0 ? i : null,
      )
      arr.filter(Boolean)
    },
    { time: 1000, iterations: 200 },
  )
})

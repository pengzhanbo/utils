import { describe, bench } from 'vitest'
import { zip } from '../../array/zip'

describe('Performance > Array > Zip', () => {
  // ZP-01: Two arrays / 两个数组
  bench(
    'zip | 2 arrays (10K items)',
    () => {
      const a = Array.from({ length: 10000 }, (_, i) => i)
      const b = Array.from({ length: 10000 }, (_, i) => `item_${i}`)
      zip(a, b)
    },
    { time: 1000, iterations: 200 },
  )

  // ZP-02: Four arrays / 四个数组
  bench(
    'zip | 4 arrays (10K items)',
    () => {
      const a = Array.from({ length: 10000 }, (_, i) => i)
      const b = Array.from({ length: 10000 }, (_, i) => `item_${i}`)
      const c = Array.from({ length: 10000 }, (_, i) => i % 2 === 0)
      const d = Array.from({ length: 10000 }, (_, i) => ({ id: i }))
      zip(a, b, c, d)
    },
    { time: 1000, iterations: 100 },
  )

  // ZP-03: Small arrays / 小数组
  bench(
    'zip | 2 arrays (10 items)',
    () => {
      const a = Array.from({ length: 10 }, (_, i) => i)
      const b = Array.from({ length: 10 }, (_, i) => `item_${i}`)
      zip(a, b)
    },
    { time: 1000, iterations: 500 },
  )

  // ZP-04: Manual loop baseline / 手动循环基线
  bench(
    'manual loop baseline | 2 arrays (10K items)',
    () => {
      const a = Array.from({ length: 10000 }, (_, i) => i)
      const b = Array.from({ length: 10000 }, (_, i) => `item_${i}`)
      const minLength = Math.min(a.length, b.length)
      const result: unknown[][] = []
      for (let i = 0; i < minLength; i++) {
        result.push([a[i], b[i]])
      }
      void result
    },
    { time: 1000, iterations: 200 },
  )
})

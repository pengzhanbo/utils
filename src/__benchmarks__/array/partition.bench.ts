import { describe, bench } from 'vitest'
import { partition } from '../../array/partition'

describe('Performance > Array > Partition', () => {
  // PT-01: Small array / 小数组
  bench(
    'partition | small array (100 items, 50% pass)',
    () => {
      const arr = Array.from({ length: 100 }, (_, i) => i)
      partition(arr, (n) => n % 2 === 0)
    },
    { time: 1000, iterations: 500 },
  )

  // PT-02: Medium array / 中型数组
  bench(
    'partition | medium array (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i)
      partition(arr, (n) => n % 2 === 0)
    },
    { time: 1000, iterations: 200 },
  )

  // PT-03: Large array / 大型数组
  bench(
    'partition | large array (100K items)',
    () => {
      const arr = Array.from({ length: 100000 }, (_, i) => i)
      partition(arr, (n) => n < 50000)
    },
    { time: 2000, iterations: 50 },
  )

  // PT-04: Complex predicate / 复杂谓词
  bench(
    'partition | complex predicate (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `item_${i}`,
        score: Math.floor(Math.random() * 100),
        active: i % 3 !== 0,
      }))
      partition(arr, (item) => item.active && item.score >= 50)
    },
    { time: 1000, iterations: 100 },
  )

  // PT-05: String predicates / 字符串谓词
  bench(
    'partition | string length check (10K strings)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => 'x'.repeat((i % 10) + 1))
      partition(arr, (s) => s.length > 5)
    },
    { time: 1000, iterations: 100 },
  )

  // PT-06: vs filter×2 baseline / 与filter×2对比
  bench(
    'filter×2 baseline | two filter calls (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i)
      const pass = arr.filter((n) => n % 2 === 0)
      void arr.filter((n) => n % 2 !== 0)
      void pass.length
    },
    { time: 1000, iterations: 200 },
  )
})

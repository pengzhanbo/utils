import { describe, bench } from 'vitest'
import { maxBy } from '../../array/max-by'
import { minBy } from '../../array/min-by'

describe('Performance > Array > MinMaxBy', () => {
  // MM-01: Numbers / 数字
  bench(
    'minBy | numbers (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i)
      minBy(arr, (n) => n)
    },
    { time: 1000, iterations: 200 },
  )

  // MM-02: Numbers / 数字
  bench(
    'maxBy | numbers (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i)
      maxBy(arr, (n) => n)
    },
    { time: 1000, iterations: 200 },
  )

  // MM-03: Strings / 字符串
  bench(
    'minBy | strings (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => `item_${i}`)
      minBy(arr, (s) => s)
    },
    { time: 1000, iterations: 200 },
  )

  // MM-04: Strings / 字符串
  bench(
    'maxBy | strings (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => `item_${i}`)
      maxBy(arr, (s) => s)
    },
    { time: 1000, iterations: 200 },
  )

  // MM-05: Objects / 对象
  bench(
    'minBy | objects (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        score: Math.floor(Math.random() * 100),
      }))
      minBy(arr, (item) => item.score)
    },
    { time: 1000, iterations: 100 },
  )

  // MM-06: Objects / 对象
  bench(
    'maxBy | objects (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        score: Math.floor(Math.random() * 100),
      }))
      maxBy(arr, (item) => item.score)
    },
    { time: 1000, iterations: 100 },
  )
})

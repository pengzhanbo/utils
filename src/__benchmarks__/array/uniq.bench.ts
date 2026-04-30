import { describe, bench } from 'vitest'
import { uniq, uniqBy, uniqWith } from '../../array/uniq'

describe('Performance > Array > Uniq', () => {
  // UQ-01: Small array with many duplicates / 小数组多重复
  bench(
    'uniq | small array (100 items, 50% duplicates)',
    () => {
      const arr = Array.from({ length: 100 }, (_, i) => i % 50)
      uniq(arr)
    },
    { time: 1000, iterations: 500 },
  )

  // UQ-02: Medium array / 中型数组
  bench(
    'uniq | medium array (10K items, 20% duplicates)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i % 2000)
      uniq(arr)
    },
    { time: 1000, iterations: 200 },
  )

  // UQ-03: Large array / 大型数组
  bench(
    'uniq | large array (100K items, 10% duplicates)',
    () => {
      const arr = Array.from({ length: 100000 }, (_, i) => i % 10000)
      uniq(arr)
    },
    { time: 2000, iterations: 50 },
  )

  // UQ-04: No duplicates (worst case for Set) / 无重复（Set最坏情况）
  bench(
    'uniq | no duplicates (100K unique items)',
    () => {
      const arr = Array.from({ length: 100000 }, (_, i) => i)
      uniq(arr)
    },
    { time: 2000, iterations: 50 },
  )

  // UQ-05: All duplicates (best case) / 全部重复（最佳情况）
  bench(
    'uniq | all duplicates (100K same value)',
    () => {
      const arr = Array.from({ length: 100000 }, () => 42)
      uniq(arr)
    },
    { time: 1000, iterations: 100 },
  )

  // UQ-06: uniqBy with object key extractor / 对象键提取器
  bench(
    'uniqBy | objects with id field (10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => ({
        id: Math.floor(i / 3),
        name: `item_${i}`,
        value: i,
      }))
      uniqBy(arr, (item) => item.id)
    },
    { time: 1000, iterations: 100 },
  )

  // UQ-07: uniqBy with computed key / 计算键
  bench(
    'uniqBy | computed key (Math.floor, 10K items)',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i * 0.5)
      uniqBy(arr, Math.floor)
    },
    { time: 1000, iterations: 100 },
  )

  // UQ-08: uniqWith custom comparator / 自定义比较器
  bench(
    'uniqWith | custom equality (1K items)',
    () => {
      const arr = Array.from({ length: 1000 }, (_, i) => ({
        x: Math.floor(i / 5),
        y: i,
      }))
      uniqWith(arr, (a, b) => a.x === b.x)
    },
    { time: 1000, iterations: 100 },
  )

  // UQ-09: vs manual Set conversion / 与手动Set转换对比
  bench(
    'Manual Set | Array.from(new Set()) (100K items)',
    () => {
      const arr = Array.from({ length: 100000 }, (_, i) => i % 10000)
      Array.from(new Set(arr))
    },
    { time: 2000, iterations: 50 },
  )
})

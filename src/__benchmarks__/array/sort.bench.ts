import { describe, bench } from 'vitest'
import { orderBy } from '../../array/order-by'
import { generateUserArray } from '../helpers/data-generators'
import { MEDIUM_USER_ARRAY } from '../helpers/fixtures'

describe('Performance > Array > OrderBy', () => {
  const smallUsers = generateUserArray(100)
  const mediumUsers = MEDIUM_USER_ARRAY
  const largeUsers = generateUserArray(100000)

  // SO-01: Small array single field sort / 小数组单字段排序
  bench(
    'Single field sort | small array (100 items)',
    () => {
      orderBy(smallUsers, 'age')
    },
    { time: 1000, iterations: 500 },
  )

  // SO-02: Medium array single field sort / 中数组单字段排序
  bench(
    'Single field sort | medium array (10K items)',
    () => {
      orderBy(mediumUsers, 'age')
    },
    { time: 2000, iterations: 100 },
  )

  // SO-03: Large array single field sort / 大数组单字段排序
  bench(
    'Single field sort | large array (100K items)',
    () => {
      orderBy(largeUsers, 'age')
    },
    { time: 3000, iterations: 20 },
  )

  // SO-04: Multi-field sort / 多字段排序
  bench(
    'Multi-field sort | medium array, 3 fields (dept asc, age desc, name asc)',
    () => {
      orderBy(mediumUsers, ['department', 'age', 'name'], ['asc', 'desc', 'asc'])
    },
    { time: 2000, iterations: 50 },
  )

  // SO-05: Function as sort key / 函数作为排序键
  bench(
    'Function as sort key | medium array, computed field',
    () => {
      orderBy(mediumUsers, [(u) => u.name.toLowerCase()])
    },
    { time: 2000, iterations: 50 },
  )

  // SO-06: Mixed sort directions / 混合排序方向
  bench(
    'Mixed sort directions | medium array, 2 fields (asc + desc)',
    () => {
      orderBy(mediumUsers, ['score', 'id'], ['desc', 'asc'])
    },
    { time: 2000, iterations: 100 },
  )

  // SO-07: vs Native sort / 与原生sort对比
  bench(
    'Native Array.sort | medium array, single field',
    () => {
      ;[...mediumUsers].sort((a, b) => a.age - b.age)
    },
    { time: 2000, iterations: 100 },
  )

  // SO-08: Already sorted array (best case) / 已排序数组（最佳情况）
  bench(
    'Best case | already sorted array (10K items)',
    () => {
      const sorted = [...mediumUsers].sort((a, b) => a.id - b.id)
      orderBy(sorted, 'id')
    },
    { time: 2000, iterations: 100 },
  )

  // SO-09: Reverse sorted array (worst case) / 逆序数组（最差情况）
  bench(
    'Worst case | reverse sorted array (10K items)',
    () => {
      const reversed = [...mediumUsers].sort((a, b) => b.id - a.id)
      orderBy(reversed, 'id')
    },
    { time: 2000, iterations: 100 },
  )
})

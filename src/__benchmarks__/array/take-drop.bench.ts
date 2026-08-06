import { describe, bench } from 'vitest'
import { dropRight } from '../../array/drop-right.js'
import { drop } from '../../array/drop.js'
import { takeRight } from '../../array/take-right.js'
import { take } from '../../array/take.js'

describe('performance > Array > TakeDrop', () => {
  // TD-01: take 10K / 截取 10K
  bench(
    'take | 10K items',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i)
      take(arr, 5000)
    },
    { time: 1000, iterations: 200 },
  )

  // TD-02: drop 10K / 丢弃 10K
  bench(
    'drop | 10K items',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i)
      drop(arr, 5000)
    },
    { time: 1000, iterations: 200 },
  )

  // TD-03: takeRight 10K / 从末尾截取 10K
  bench(
    'takeRight | 10K items',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i)
      takeRight(arr, 5000)
    },
    { time: 1000, iterations: 200 },
  )

  // TD-04: dropRight 10K / 从末尾丢弃 10K
  bench(
    'dropRight | 10K items',
    () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i)
      dropRight(arr, 5000)
    },
    { time: 1000, iterations: 200 },
  )

  // TD-05: take small / 小数组截取
  bench(
    'take | small array (10 items)',
    () => {
      const arr = Array.from({ length: 10 }, (_, i) => i)
      take(arr, 3)
    },
    { time: 1000, iterations: 1000 },
  )

  // TD-06: drop small / 小数组丢弃
  bench(
    'drop | small array (10 items)',
    () => {
      const arr = Array.from({ length: 10 }, (_, i) => i)
      drop(arr, 3)
    },
    { time: 1000, iterations: 1000 },
  )

  // TD-07: takeRight small / 小数组从末尾截取
  bench(
    'takeRight | small array (10 items)',
    () => {
      const arr = Array.from({ length: 10 }, (_, i) => i)
      takeRight(arr, 3)
    },
    { time: 1000, iterations: 1000 },
  )

  // TD-08: dropRight small / 小数组从末尾丢弃
  bench(
    'dropRight | small array (10 items)',
    () => {
      const arr = Array.from({ length: 10 }, (_, i) => i)
      dropRight(arr, 3)
    },
    { time: 1000, iterations: 1000 },
  )
})

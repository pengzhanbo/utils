import { describe, bench } from 'vitest'
import { random } from '../../math/random'

describe('Performance > Math > Random', () => {
  // RN-01: Simple integer range / 简单整数范围
  bench(
    'random | integer [0, 100)',
    () => {
      random(100)
    },
    { time: 1000, iterations: 10000 },
  )

  // RN-02: Integer range with min/max / 带范围的整数
  bench(
    'random | integer [50, 150]',
    () => {
      random(50, 150)
    },
    { time: 1000, iterations: 10000 },
  )

  // RN-03: Float generation / 浮点数生成
  bench(
    'random | float [0, 1)',
    () => {
      random(1, true)
    },
    { time: 1000, iterations: 10000 },
  )

  // RN-04: Float with range / 带范围浮点数
  bench(
    'random | float [0, 1000)',
    () => {
      random(1000, true)
    },
    { time: 1000, iterations: 10000 },
  )

  // RN-05: vs raw Math.random baseline / 与原生Math.random对比
  bench(
    'Math.random baseline | scaled to [0, 100)',
    () => {
      Math.floor(Math.random() * 100)
    },
    { time: 1000, iterations: 10000 },
  )

  // RN-06: Batch generation / 批量生成
  bench(
    'batch generation | generate 1000 random ints',
    () => {
      const result: number[] = []
      for (let i = 0; i < 1000; i++) {
        result.push(random(10000))
      }
      void result.length
    },
    { time: 1000, iterations: 500 },
  )
})

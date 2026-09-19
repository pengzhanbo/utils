import { describe, it } from 'vitest'
import { random } from '../../math/random.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Math > Random', () => {
  // RN-01: Simple integer range / 简单整数范围
  // RN-02: Integer range with min/max / 带范围的整数
  // RN-03: Float generation / 浮点数生成
  // RN-04: Float with range / 带范围浮点数
  // RN-05: vs raw Math.random baseline / 与原生Math.random对比
  // RN-01 ~ RN-05: Single number; sub-microsecond rows, so each sample batches 1000 calls to
  // escape the timer resolution floor / 单个数字；亚微秒级基准，每次采样批量执行 1000 次调用以脱离计时器分辨率下限
  it('single number generation', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('random | integer [0, 100)', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            acc += random(100)
          }
          return acc
        }),
        bench('random | integer [50, 150]', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            acc += random(50, 150)
          }
          return acc
        }),
        bench('random | float [0, 1)', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            acc += random(1, true)
          }
          return acc
        }),
        bench('random | float [0, 1000)', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            acc += random(1000, true)
          }
          return acc
        }),
        bench('math.random baseline | scaled to [0, 100)', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            acc += Math.floor(Math.random() * 100)
          }
          return acc
        }),
      ],
      { time: 1000, iterations: 100 },
    )
  })

  // RN-06: Batch generation / 批量生成
  it('batch generation, 1000 ints', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('batch generation', () => {
          const result: number[] = []
          for (let i = 0; i < 1000; i++) {
            result.push(random(10000))
          }
          return result
        }),
      ],
      { time: 1000, iterations: 500 },
    )
  })
})

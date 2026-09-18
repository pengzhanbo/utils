import { describe, it } from 'vitest'
import { throttle } from '../../function/throttle.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Function > Throttle', () => {
  // TH-01: Creation overhead / 创建开销
  it('throttle creation', async ({ bench }) => {
    await runBenchmarks(bench, [bench('throttle creation', () => throttle(100, () => {}))], {
      time: 1000,
      iterations: 1000,
    })
  })

  // TH-02 ~ TH-03: Same 100-call burst, so they share one comparison table
  // TH-02 ~ TH-03: 同为 100 次调用突发，放在同一张对比表中
  it('100 calls, delay=10ms', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        // TH-02: Trailing edge mode (default) / 后沿模式（默认）
        bench('trailing mode', async () => {
          let count = 0
          const fn = throttle(10, () => {
            count++
          })

          for (let i = 0; i < 100; i++) {
            fn()
          }

          await new Promise((resolve) => void setTimeout(resolve, 50))
          return count
        }),
        // TH-03: Leading edge mode / 前沿模式
        bench('leading mode', async () => {
          let count = 0
          const fn = throttle(
            10,
            () => {
              count++
            },
            { noTrailing: true },
          )

          for (let i = 0; i < 100; i++) {
            fn()
          }

          await new Promise((resolve) => void setTimeout(resolve, 30))
          return count
        }),
      ],
      { time: 2000, iterations: 100 },
    )
  })

  // TH-04: noLeading + noTrailing / 双禁模式
  it('50 calls, both edges disabled', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('noLeading + noTrailing', async () => {
          let count = 0
          const fn = throttle(
            10,
            () => {
              count++
            },
            { noLeading: true, noTrailing: true },
          )

          for (let i = 0; i < 50; i++) {
            fn()
          }

          await new Promise((resolve) => void setTimeout(resolve, 50))
          return count
        }),
      ],
      { time: 2000, iterations: 100 },
    )
  })

  // TH-05: Cancel operation / 取消操作
  it('cancel', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('cancel', () => {
          const fn = throttle(100, () => {})
          return fn.cancel()
        }),
      ],
      { time: 1000, iterations: 1000 },
    )
  })

  // TH-06: Cancel after invocation / 调用后取消
  it('cancel after call', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('cancel after call', async () => {
          let count = 0
          const fn = throttle(50, () => {
            count++
          })

          fn()
          fn.cancel()

          await new Promise((resolve) => void setTimeout(resolve, 80))
          return count
        }),
      ],
      { time: 1000, iterations: 100 },
    )
  })

  // TH-07: Arguments passing / 参数传递
  it('arguments passing, 20 calls', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('arguments passing', async () => {
          const results: number[][] = []
          const fn = throttle(10, (...args: number[]) => {
            results.push(args)
          })

          for (let i = 0; i < 20; i++) {
            fn(i, i * 2, i * 3)
          }

          await new Promise((resolve) => void setTimeout(resolve, 50))
          return results.length
        }),
      ],
      { time: 2000, iterations: 100 },
    )
  })
})

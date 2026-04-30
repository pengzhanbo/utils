import { describe, bench } from 'vitest'
import { throttle } from '../../function/throttle'

describe('Performance > Function > Throttle', () => {
  // TH-01: Creation overhead / 创建开销
  bench(
    'throttle creation | delay=100ms',
    () => {
      throttle(100, () => {})
    },
    { time: 1000, iterations: 1000 },
  )

  // TH-02: Trailing edge mode (default) / 后沿模式（默认）
  bench(
    'trailing mode | rapid calls, delay=10ms',
    async () => {
      let count = 0
      const fn = throttle(10, () => {
        count++
      })

      for (let i = 0; i < 100; i++) {
        fn()
      }

      await new Promise((resolve) => setTimeout(resolve, 50))
      void count
    },
    { time: 2000, iterations: 100 },
  )

  // TH-03: Leading edge mode / 前沿模式
  bench(
    'leading mode | noTrailing=true, delay=10ms',
    async () => {
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

      await new Promise((resolve) => setTimeout(resolve, 30))
      void count
    },
    { time: 2000, iterations: 100 },
  )

  // TH-04: noLeading + noTrailing / 双禁模式
  bench(
    'noLeading + noTrailing | skip both edges',
    async () => {
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

      await new Promise((resolve) => setTimeout(resolve, 50))
      void count
    },
    { time: 2000, iterations: 100 },
  )

  // TH-05: Cancel operation / 取消操作
  bench(
    'cancel | create and immediately cancel',
    () => {
      const fn = throttle(100, () => {})
      fn.cancel()
    },
    { time: 1000, iterations: 1000 },
  )

  // TH-06: Cancel after invocation / 调用后取消
  bench(
    'cancel after call | prevent trailing execution',
    async () => {
      let count = 0
      const fn = throttle(50, () => {
        count++
      })

      fn()
      fn.cancel()

      await new Promise((resolve) => setTimeout(resolve, 80))
      void count
    },
    { time: 1000, iterations: 100 },
  )

  // TH-07: Arguments passing / 参数传递
  bench(
    'arguments passing | multiple args per call',
    async () => {
      const results: number[][] = []
      const fn = throttle(10, (...args: number[]) => {
        results.push(args)
      })

      for (let i = 0; i < 20; i++) {
        fn(i, i * 2, i * 3)
      }

      await new Promise((resolve) => setTimeout(resolve, 50))
      void results.length
    },
    { time: 2000, iterations: 100 },
  )
})

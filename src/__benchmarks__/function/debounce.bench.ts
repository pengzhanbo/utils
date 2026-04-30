import { describe, bench } from 'vitest'
import { debounce } from '../../function/debounce'

describe('Performance > Function > Debounce', () => {
  // DB-01: Creation overhead / 创建开销
  bench(
    'debounce creation | delay=100ms',
    () => {
      debounce(100, () => {})
    },
    { time: 1000, iterations: 1000 },
  )

  // DB-02: Rapid invocation (debounced) / 快速调用（防抖）
  bench(
    'rapid invocation | 100 calls in burst, delay=10ms',
    async () => {
      let count = 0
      const fn = debounce(10, () => {
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

  // DB-03: atBegin mode (leading edge) / 前沿模式
  bench(
    'atBegin mode | leading edge execution, delay=10ms',
    async () => {
      let count = 0
      const fn = debounce(
        10,
        () => {
          count++
        },
        { atBegin: true },
      )

      for (let i = 0; i < 50; i++) {
        fn()
      }

      await new Promise((resolve) => setTimeout(resolve, 30))
      void count
    },
    { time: 2000, iterations: 100 },
  )

  // DB-04: Cancel operation / 取消操作
  bench(
    'cancel | create and immediately cancel',
    () => {
      const fn = debounce(100, () => {})
      fn.cancel()
    },
    { time: 1000, iterations: 1000 },
  )

  // DB-05: Cancel with options / 带选项的取消
  bench(
    'cancel(options) | cancel upcoming only',
    () => {
      const fn = debounce(100, () => {})
      fn()
      fn.cancel({ upcomingOnly: true })
    },
    { time: 1000, iterations: 1000 },
  )

  // DB-06: Long delay / 长延迟
  bench(
    'long delay | delay=500ms, single call',
    async () => {
      let executed = false
      const fn = debounce(500, () => {
        executed = true
      })
      fn()

      await new Promise((resolve) => setTimeout(resolve, 10))
      void executed
    },
    { time: 1000, iterations: 50 },
  )
})

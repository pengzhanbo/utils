import { describe, it } from 'vitest'
import { debounce } from '../../function/debounce.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Function > Debounce', () => {
  // DB-01: Creation overhead / 创建开销
  it('debounce creation', async ({ bench }) => {
    await runBenchmarks(bench, [bench('debounce creation', () => debounce(100, () => {}))], {
      time: 1000,
      iterations: 1000,
    })
  })

  // DB-02: Rapid invocation (debounced) / 快速调用（防抖）
  it('rapid invocation, 100 calls', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('rapid invocation', async () => {
          let count = 0
          const fn = debounce(10, () => {
            count++
          })

          for (let i = 0; i < 100; i++) {
            fn()
          }

          await new Promise((resolve) => void setTimeout(resolve, 50))
          return count
        }),
      ],
      { time: 2000, iterations: 100 },
    )
  })

  // DB-03: atBegin mode (leading edge) / 前沿模式
  it('atBegin mode, 50 calls', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('atBegin mode', async () => {
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

          await new Promise((resolve) => void setTimeout(resolve, 30))
          return count
        }),
      ],
      { time: 2000, iterations: 100 },
    )
  })

  // DB-04 ~ DB-05: Cancel variants sharing the same setup
  // DB-04 ~ DB-05: 同为取消变体，共用同一套配置
  it('cancel variants', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        // DB-04: Cancel operation / 取消操作
        bench('cancel', () => {
          const fn = debounce(100, () => {})
          return fn.cancel()
        }),
        // DB-05: Cancel with options / 带选项的取消
        bench('cancel(options)', () => {
          const fn = debounce(100, () => {})
          fn()
          return fn.cancel({ upcomingOnly: true })
        }),
      ],
      { time: 1000, iterations: 1000 },
    )
  })

  // DB-06: Long delay / 长延迟
  it('long delay', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('long delay', async () => {
          let executed = false
          const fn = debounce(500, () => {
            executed = true
          })
          fn()

          await new Promise((resolve) => void setTimeout(resolve, 10))
          return executed
        }),
      ],
      { time: 1000, iterations: 50 },
    )
  })
})

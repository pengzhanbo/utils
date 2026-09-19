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

  // DB-01b: Pure invocation path — throughput / 纯调用路径 — 吞吐
  //
  // No timer is awaited: the burst finishes with `fn.cancel()`, so the timed
  // region only covers synchronous call overhead. Compare implementations /
  // option sets against this group rather than the latency groups below.
  //
  // 不等待任何定时器：调用结束后以 `fn.cancel()` 清理挂起的定时器，
  // 计时区间只覆盖同步调用开销。跨实现 / 选项组对比请以本组为准，
  // 而不是下方延迟场景组。
  it('pure invocation path, 1000 calls', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        // DB-01b: Default (trailing) / 默认（后缘）
        bench('pure invocation path, default (trailing)', () => {
          let count = 0
          const fn = debounce(100, () => {
            count++
          })

          for (let i = 0; i < 1000; i++) {
            fn()
          }
          fn.cancel()
          return count
        }),
        // DB-01b: atBegin mode (leading) / 前沿模式
        bench('pure invocation path, atBegin', () => {
          let count = 0
          const fn = debounce(
            100,
            () => {
              count++
            },
            { atBegin: true },
          )

          for (let i = 0; i < 1000; i++) {
            fn()
          }
          fn.cancel()
          return count
        }),
      ],
      { time: 1000, iterations: 200 },
    )
  })

  // DB-02: Rapid invocation — scheduling latency / 快速调用 — 调度延迟
  // Timed region includes the 50ms `setTimeout` wait, so it measures debounce
  // scheduling latency rather than call throughput.
  // 计时区间包含 50ms 的 `setTimeout` 等待，衡量的是防抖调度延迟而非调用吞吐。
  it('latency: rapid invocation, 100 calls', async ({ bench }) => {
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

  // DB-03: atBegin mode — scheduling latency / 前沿模式 — 调度延迟
  // Timed region includes the 30ms `setTimeout` wait; latency, not throughput.
  // 计时区间包含 30ms 的 `setTimeout` 等待，衡量延迟而非吞吐。
  it('latency: atBegin mode, 50 calls', async ({ bench }) => {
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
  // Batched (1000 create+cancel pairs per sample) and given more samples / a
  // longer time budget to push the previously noisy ~±33% rme down.
  // DB-04 ~ DB-05: 同为取消变体，共用同一套配置
  // 采用批处理（每次采样 1000 组「创建 + 取消」），并增加采样数、延长运行时间，
  // 以压低此前约 ±33% 的 rme。
  it('cancel variants', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        // DB-04: Cancel operation / 取消操作
        bench('cancel', () => {
          let count = 0
          for (let i = 0; i < 1000; i++) {
            const fn = debounce(100, () => {})
            fn.cancel()
            count++
          }
          return count
        }),
        // DB-05: Cancel with options / 带选项的取消
        bench('cancel(options)', () => {
          let count = 0
          for (let i = 0; i < 1000; i++) {
            const fn = debounce(100, () => {})
            fn()
            fn.cancel({ upcomingOnly: true })
            count++
          }
          return count
        }),
      ],
      { time: 2000, iterations: 200 },
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

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

  // TH-01b: Pure invocation path — throughput / 纯调用路径 — 吞吐
  //
  // No timer is awaited: the trailing `setTimeout` is cancelled right after the
  // burst, so the timed region only covers synchronous call overhead. Compare
  // implementations / option sets against this group, not against the latency
  // groups below.
  //
  // 不等待任何定时器：后缘调度的 `setTimeout` 在调用结束后立即取消，
  // 计时区间只覆盖同步调用开销。跨实现 / 选项组对比请以本组为准，
  // 而不是下方延迟场景组。
  it('pure invocation path, 1000 calls', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        // TH-01b: Default (leading + trailing) / 默认（前沿 + 后缘）
        bench('pure invocation path, default (leading + trailing)', () => {
          let count = 0
          const fn = throttle(100, () => {
            count++
          })

          for (let i = 0; i < 1000; i++) {
            fn()
          }
          fn.cancel()
          return count
        }),
        // TH-01b: Both edges disabled / 双禁模式
        bench('pure invocation path, noLeading + noTrailing', () => {
          let count = 0
          const fn = throttle(
            100,
            () => {
              count++
            },
            { noLeading: true, noTrailing: true },
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

  // TH-02 ~ TH-03: Scheduling latency, NOT throughput / 调度延迟，而非吞吐
  //
  // The timed region intentionally includes the `setTimeout` wait, so these rows
  // measure scheduling correctness / delayed-execution latency instead of call
  // throughput. Never read them as a throughput number, and never compare them
  // with the pure invocation path above.
  //
  // 计时区间刻意包含 `setTimeout` 等待，因此这些行衡量的是调度正确性 /
  // 延迟执行延迟，而非调用吞吐；请勿把它们当作吞吐指标，
  // 也不要与上方纯调用路径对比。
  //
  // TH-02 ~ TH-03: Same 100-call burst, so they share one comparison table
  // TH-02 ~ TH-03: 同为 100 次调用突发，放在同一张对比表中
  it('latency: 100 calls, delay=10ms', async ({ bench }) => {
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

  // TH-04: noLeading + noTrailing — scheduling latency / 双禁模式 — 调度延迟
  // Timed region includes the 50ms `setTimeout` wait; latency, not throughput.
  // 计时区间包含 50ms 的 `setTimeout` 等待，衡量延迟而非吞吐。
  it('latency: 50 calls, both edges disabled', async ({ bench }) => {
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

  // TH-05: Cancel operation — batched / 取消操作 — 批处理
  //
  // Batches 1000 create+cancel pairs per sample so a single sample lands in the
  // millisecond range instead of sub-microsecond timer noise.
  //
  // 每次采样批量执行 1000 组「创建 + 取消」，使单次采样落在毫秒级，
  // 避免亚微秒级的定时器噪声。
  it('cancel', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('cancel', () => {
          let count = 0
          for (let i = 0; i < 1000; i++) {
            const fn = throttle(100, () => {})
            fn.cancel()
            count++
          }
          return count
        }),
      ],
      { time: 1000, iterations: 100 },
    )
  })

  // TH-06: Cancel after invocation — scheduling latency / 调用后取消 — 调度延迟
  // Timed region includes the 80ms `setTimeout` wait; latency, not throughput.
  // 计时区间包含 80ms 的 `setTimeout` 等待，衡量延迟而非吞吐。
  it('latency: cancel after call', async ({ bench }) => {
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

  // TH-07: Arguments passing — scheduling latency / 参数传递 — 调度延迟
  // Timed region includes the 50ms `setTimeout` wait; latency, not throughput.
  // 计时区间包含 50ms 的 `setTimeout` 等待，衡量延迟而非吞吐。
  it('latency: arguments passing, 20 calls', async ({ bench }) => {
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

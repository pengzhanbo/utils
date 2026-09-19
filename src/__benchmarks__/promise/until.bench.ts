import { describe, it } from 'vitest'
import { until } from '../../promise/until.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Promise > Until', () => {
  // UT-01: Condition immediately true / 条件立即为真
  it('condition true immediately', async ({ bench }) => {
    await runBenchmarks(bench, [bench('until', () => until(() => true, { interval: 100 }))], {
      time: 1000,
      iterations: 1000,
    })
  })

  // UT-02: Condition true after 3 polls — scheduling latency / 条件在 3 次轮询后为真 — 调度延迟
  //
  // The timed region intentionally includes three 1ms interval waits, so it
  // measures polling scheduling latency rather than `until` overhead. Do not read
  // it as a throughput number. More iterations plus a longer time budget reduce
  // the previously high (~±13%) rme.
  //
  // 计时区间刻意包含 3 次 1ms 的轮询等待，衡量的是轮询调度延迟而非 `until`
  // 本身的开销，请勿当作吞吐指标。提高采样数并延长运行时间，
  // 以降低此前偏高（约 ±13%）的 rme。
  it('latency: condition true after 3 polls', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('latency: condition true after 3 polls', () => {
          let count = 0
          return until(() => ++count >= 3, { interval: 1 })
        }),
      ],
      { time: 2000, iterations: 100 },
    )
  })
})

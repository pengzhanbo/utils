import { describe, it } from 'vitest'
import { retry } from '../../promise/retry.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Promise > Retry', () => {
  // RT-01 ~ RT-03: Same retry outcome scenarios, so they share one comparison table
  // RT-01 ~ RT-03: 同为重试结果场景，放在同一张对比表中
  it('retry outcomes', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        // RT-01: Immediate success / 即时成功
        bench('immediate success', () => retry(async () => 42, { limit: 3, delay: 0 })),
        // RT-02: One retry then success / 一次重试后成功
        bench('one retry then success', () => {
          let attempts = 0
          return retry(
            async () => {
              attempts++
              if (attempts < 2) {
                throw new Error('fail')
              }
              return 'success'
            },
            { limit: 3, delay: 1 },
          )
        }),
        // RT-03: Max retries reached / 达到最大重试次数
        bench('max retries reached', async () => {
          try {
            return await retry(
              async () => {
                throw new Error('always fails')
              },
              { limit: 3, delay: 1 },
            )
          } catch (error) {
            // Expected error
            return error
          }
        }),
      ],
      { time: 2000, iterations: 100 },
    )
  })

  // RT-04: Cancellation response / 取消响应时间
  it('cancellation, immediate abort', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('cancellation', async () => {
          const controller = new AbortController()
          controller.abort()

          try {
            return await retry(async () => 1, {
              limit: 3,
              signal: controller.signal,
            })
          } catch (error) {
            // Expected AbortError
            return error
          }
        }),
      ],
      { time: 2000, iterations: 200 },
    )
  })

  // RT-05: Timeout overhead / 超时检查开销
  it('timeout check', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('timeout check', () =>
          retry(async () => 1, {
            limit: 5,
            timeout: 50,
          })),
      ],
      { time: 1000, iterations: 100 },
    )
  })

  // RT-06: Retry with longer delay — scheduling latency / 较长 delay 的重试 — 调度延迟
  //
  // The timed region intentionally includes three 10ms `setTimeout` waits, so it
  // measures retry scheduling latency rather than retry overhead. Do not read it
  // as a throughput number. Iterations raised to keep the sample stable given the
  // ~22ms per-sample mean.
  //
  // 计时区间刻意包含 3 次 10ms 的 `setTimeout` 等待，衡量的是重试调度延迟
  // 而非重试本身的开销，请勿当作吞吐指标。鉴于单次采样均值约 22ms，
  // 提高采样数以保证结果稳定。
  it('latency: longer delay', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('latency: longer delay', async () => {
          try {
            return await retry(
              async () => {
                throw new Error('fail')
              },
              { limit: 3, delay: 10 },
            )
          } catch (error) {
            // Expected error after all retries
            return error
          }
        }),
      ],
      { time: 3000, iterations: 100 },
    )
  })
})

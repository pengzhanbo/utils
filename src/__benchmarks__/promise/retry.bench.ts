import { describe, bench } from 'vitest'
import { retry } from '../../promise/retry'

describe('Performance > Promise > Retry', () => {
  // RT-01: Immediate success / 即时成功
  bench(
    'Immediate success | no retries needed',
    async () => {
      await retry(() => Promise.resolve(42), { limit: 3, delay: 0 })
    },
    { time: 2000, iterations: 100 },
  )

  // RT-02: One retry then success / 一次重试后成功
  bench(
    'One retry then success | delay=1ms',
    async () => {
      let attempts = 0
      await retry(
        () => {
          attempts++
          if (attempts < 2) return Promise.reject(new Error('fail'))
          return Promise.resolve('success')
        },
        { limit: 3, delay: 1 },
      )
    },
    { time: 2000, iterations: 100 },
  )

  // RT-03: Max retries reached / 达到最大重试次数
  bench(
    'Max retries reached | limit=3, delay=1ms',
    async () => {
      try {
        await retry(
          () => {
            return Promise.reject(new Error('always fails'))
          },
          { limit: 3, delay: 1 },
        )
      } catch {
        // Expected error
      }
    },
    { time: 2000, iterations: 100 },
  )

  // RT-04: Cancellation response / 取消响应时间
  bench(
    'Cancellation | immediate abort',
    async () => {
      const controller = new AbortController()
      controller.abort()

      try {
        await retry(() => Promise.resolve(1), {
          limit: 3,
          signal: controller.signal,
        })
      } catch {
        // Expected AbortError
      }
    },
    { time: 2000, iterations: 200 },
  )

  // RT-05: Timeout overhead / 超时检查开销
  bench(
    'Timeout check | timeout=50ms with fast function',
    async () => {
      await retry(() => Promise.resolve(1), {
        limit: 5,
        timeout: 50,
      })
    },
    { time: 1000, iterations: 100 },
  )

  // RT-06: Retry with longer delay / 较长delay的重试
  bench(
    'Longer delay | delay=10ms, limit=3',
    async () => {
      try {
        await retry(
          () => {
            return Promise.reject(new Error('fail'))
          },
          { limit: 3, delay: 10 },
        )
      } catch {
        // Expected error after all retries
      }
    },
    { time: 3000, iterations: 50 },
  )
})

import { describe, bench } from 'vitest'
import { until } from '../../promise/until'

describe('Performance > Promise > Until', () => {
  // UT-01: Condition immediately true / 条件立即为真
  bench(
    'until | condition true immediately',
    async () => {
      await until(() => true, { interval: 100 })
    },
    { time: 1000, iterations: 1000 },
  )

  // UT-02: Condition true after 3 polls / 条件在 3 次轮询后为真
  bench(
    'until | condition true after 3 polls (interval 1ms)',
    async () => {
      let count = 0
      await until(() => ++count >= 3, { interval: 1 })
    },
    { time: 1000 },
  )
})

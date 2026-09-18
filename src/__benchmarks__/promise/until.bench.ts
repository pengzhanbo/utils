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

  // UT-02: Condition true after 3 polls / 条件在 3 次轮询后为真
  it('condition true after 3 polls', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('until', () => {
          let count = 0
          return until(() => ++count >= 3, { interval: 1 })
        }),
      ],
      { time: 1000 },
    )
  })
})

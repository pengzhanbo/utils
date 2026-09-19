import { describe, it } from 'vitest'
import { formatBytes } from '../../util/format-bytes.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > Util > FormatBytes', () => {
  // UB-01: Small bytes / 小字节数
  // Sub-microsecond row, so each sample batches 1000 calls to escape the timer resolution floor
  // 亚微秒级基准，每次采样批量执行 1000 次调用以脱离计时器分辨率下限
  it('small bytes', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('formatBytes (small)', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            acc += formatBytes(500).length
          }
          return acc
        }),
      ],
      { time: 1000, iterations: 100 },
    )
  })

  // UB-02: Medium bytes decimal / 中型字节数（十进制）
  // UB-03: Medium bytes binary / 中型字节数（二进制）
  // UB-02 + UB-03: Same 1572864 value, decimal vs binary / 同为 1572864，十进制与二进制对比
  it('medium bytes, decimal vs binary', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('formatBytes (decimal)', () => formatBytes(1572864)),
        bench('formatBytes (binary)', () => formatBytes(1572864, { binary: true })),
      ],
      { time: 1000, iterations: 500 },
    )
  })

  // UB-04: Large bytes / 大字节数
  it('large bytes', async ({ bench }) => {
    await runBenchmarks(bench, [bench('formatBytes (large)', () => formatBytes(5e12))], {
      time: 1000,
      iterations: 500,
    })
  })
})

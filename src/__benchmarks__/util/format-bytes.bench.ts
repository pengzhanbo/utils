import { describe, bench } from 'vitest'
import { formatBytes } from '../../util/format-bytes'

describe('Performance > Util > FormatBytes', () => {
  // UB-01: Small bytes / 小字节数
  bench(
    'formatBytes | small bytes (500)',
    () => {
      formatBytes(500)
    },
    { time: 1000, iterations: 500 },
  )

  // UB-02: Medium bytes decimal / 中型字节数（十进制）
  bench(
    'formatBytes | medium bytes decimal (1572864)',
    () => {
      formatBytes(1572864)
    },
    { time: 1000, iterations: 500 },
  )

  // UB-03: Medium bytes binary / 中型字节数（二进制）
  bench(
    'formatBytes | medium bytes binary (1572864)',
    () => {
      formatBytes(1572864, { binary: true })
    },
    { time: 1000, iterations: 500 },
  )

  // UB-04: Large bytes / 大字节数
  bench(
    'formatBytes | large bytes (5e12)',
    () => {
      formatBytes(5e12)
    },
    { time: 1000, iterations: 500 },
  )
})

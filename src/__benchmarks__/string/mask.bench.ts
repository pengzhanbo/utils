import { describe, it } from 'vitest'
import { mask } from '../../string/mask.js'
import { runBenchmarks } from '../helpers/baseline.js'

describe('performance > String > Mask', () => {
  // Inputs are pre-allocated outside the timed function to keep GC noise out of the results
  // 输入数据在计时区间外预分配，避免构造开销与 GC 噪声污染结果
  const phone = '13800138000'
  const email = 'user@example.com'
  const longValue = 'x'.repeat(200)

  // MK-01: Short string (default options) / 短字符串（默认选项）
  // MK-04: Manual slice baseline / 手动 slice 基线
  // MK-01 + MK-04: Same 11-char scale, mask vs slice baseline / 同为 11 字符规模，mask 与 slice 基线对比
  // Every row is sub-microsecond, so each sample batches 1000 calls to escape the timer
  // resolution floor / 各行均处于亚微秒级，每次采样批量执行 1000 次调用以脱离计时器分辨率下限
  it('11-char phone number', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('mask', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            acc += mask(phone).length
          }
          return acc
        }),
        bench('slice baseline', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            const s = 3
            const e = phone.length + -4
            acc += (phone.slice(0, s) + '*'.repeat(e - s) + phone.slice(e)).length
          }
          return acc
        }),
      ],
      { time: 1000, iterations: 100 },
    )
  })

  // MK-02: Email string / 邮箱字符串
  // Sub-microsecond row, so each sample batches 1000 calls / 亚微秒级基准，每次采样批量执行 1000 次调用
  it('email, 20 chars', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('mask', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            acc += mask(email, { start: 1, end: 4 }).length
          }
          return acc
        }),
      ],
      { time: 1000, iterations: 100 },
    )
  })

  // MK-03: Long string / 长字符串
  // Sub-microsecond row, so each sample batches 1000 calls / 亚微秒级基准，每次采样批量执行 1000 次调用
  it('long string, 200 chars', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('mask', () => {
          let acc = 0
          for (let i = 0; i < 1000; i++) {
            acc += mask(longValue).length
          }
          return acc
        }),
      ],
      { time: 1000, iterations: 100 },
    )
  })
})

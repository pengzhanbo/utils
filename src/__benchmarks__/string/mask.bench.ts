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
  it('11-char phone number', async ({ bench }) => {
    await runBenchmarks(
      bench,
      [
        bench('mask', () => mask(phone)),
        bench('slice baseline', () => {
          const s = 3
          const e = phone.length + -4
          return phone.slice(0, s) + '*'.repeat(e - s) + phone.slice(e)
        }),
      ],
      { time: 1000, iterations: 500 },
    )
  })

  // MK-02: Email string / 邮箱字符串
  it('email, 20 chars', async ({ bench }) => {
    await runBenchmarks(bench, [bench('mask', () => mask(email, { start: 1, end: 4 }))], {
      time: 1000,
      iterations: 500,
    })
  })

  // MK-03: Long string / 长字符串
  it('long string, 200 chars', async ({ bench }) => {
    await runBenchmarks(bench, [bench('mask', () => mask(longValue))], {
      time: 1000,
      iterations: 500,
    })
  })
})

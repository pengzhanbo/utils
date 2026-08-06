import { describe, bench } from 'vitest'
import { mask } from '../../string/mask.js'

describe('performance > String > Mask', () => {
  // MK-01: Short string (default options) / 短字符串（默认选项）
  bench(
    'mask | short phone number (11 chars, default)',
    () => {
      mask('13800138000')
    },
    { time: 1000, iterations: 500 },
  )

  // MK-02: Email string / 邮箱字符串
  bench(
    'mask | email (20 chars, explicit start/end)',
    () => {
      mask('user@example.com', { start: 1, end: 4 })
    },
    { time: 1000, iterations: 500 },
  )

  // MK-03: Long string / 长字符串
  bench(
    'mask | long string (200 chars, default)',
    () => {
      mask('x'.repeat(200))
    },
    { time: 1000, iterations: 500 },
  )

  // MK-04: Manual slice baseline / 手动 slice 基线
  bench(
    'slice baseline | manual masking (11 chars)',
    () => {
      const value = '13800138000'
      const s = 3
      const e = value.length + -4
      void (value.slice(0, s) + '*'.repeat(e - s) + value.slice(e))
    },
    { time: 1000, iterations: 500 },
  )
})

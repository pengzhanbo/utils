import { afterEach, describe, expect, it, vi } from 'vitest'
import { isSameDay } from './is-same-day.js'

describe('date > isSameDay', () => {
  it('should return true for same day dates', () => {
    const date1 = new Date('2024-01-15T10:30:00')
    const date2 = new Date('2024-01-15T23:59:59')
    expect(isSameDay(date1, date2)).toBe(true)
  })

  it('should return false for different days', () => {
    const date1 = new Date('2024-01-15')
    const date2 = new Date('2024-01-16')
    expect(isSameDay(date1, date2)).toBe(false)
  })

  it('should return true when both dates are timestamp 0', () => {
    expect(isSameDay(0, 0)).toBe(true)
  })

  it('should return false when second date is undefined', () => {
    expect(isSameDay(new Date(), undefined)).toBe(false)
  })

  it('should return false when second date is not provided', () => {
    const date1 = new Date('2024-01-15')
    expect(isSameDay(date1)).toBe(false)
  })

  it('should return false for different months', () => {
    const date1 = new Date('2024-01-15')
    const date2 = new Date('2024-02-15')
    expect(isSameDay(date1, date2)).toBe(false)
  })

  it('should return false for different years', () => {
    const date1 = new Date('2024-01-15')
    const date2 = new Date('2023-01-15')
    expect(isSameDay(date1, date2)).toBe(false)
  })

  it('should handle timestamp inputs', () => {
    const timestamp1 = new Date('2024-01-15').getTime()
    const timestamp2 = new Date('2024-01-15T23:59:59').getTime()
    expect(isSameDay(timestamp1, timestamp2)).toBe(true)
  })

  it('should handle string date inputs', () => {
    expect(isSameDay('2024-01-15', '2024-01-15')).toBe(true)
    expect(isSameDay('2024-01-15', '2024-01-16')).toBe(false)
  })

  it('should handle invalid date inputs', () => {
    expect(isSameDay('invalid', '2024-01-15')).toBe(false)
    expect(isSameDay('2024-01-15', 'invalid')).toBe(false)
    expect(isSameDay(Number.NaN, '2024-01-15')).toBe(false)
  })

  it('should handle edge case of day boundaries', () => {
    const date1 = new Date('2024-01-15T00:00:00')
    const date2 = new Date('2024-01-15T23:59:59')
    expect(isSameDay(date1, date2)).toBe(true)
  })

  it('should treat date-only ISO strings as UTC instants', () => {
    // `'2024-01-15'` 按规范解析为 UTC 午夜；与同一 UTC 时刻比较必然同天
    expect(isSameDay('2024-01-15', new Date('2024-01-15T00:00:00Z'))).toBe(true)
  })

  it('should return true for leap year dates', () => {
    const date1 = new Date('2024-02-29')
    const date2 = new Date('2024-02-29')
    expect(isSameDay(date1, date2)).toBe(true)
  })

  it('should return false for Dec 1 vs Feb 11 (collision bug)', () => {
    const dec1 = new Date(2024, 11, 1)
    const feb11 = new Date(2024, 1, 11)
    expect(isSameDay(dec1, feb11)).toBe(false)
  })

  it('should return false for Dec 1-9 vs Feb 11-19 (collision bug)', () => {
    for (let i = 1; i <= 9; i++) {
      const dec = new Date(2024, 11, i)
      const feb = new Date(2024, 1, 10 + i)
      expect(isSameDay(dec, feb)).toBe(false)
    }
  })

  it('should return false for different invalid date values', () => {
    expect(isSameDay('invalid', 'foo')).toBe(false)
    expect(isSameDay(Number.NaN, 'invalid')).toBe(false)
  })

  it('should return false for same invalid date value', () => {
    expect(isSameDay('invalid', 'invalid')).toBe(false)
    expect(isSameDay('not-a-date', 'also-not-a-date')).toBe(false)
  })

  it('should compare a timestamp with a Date object of the same local day', () => {
    const date = new Date(2024, 0, 15, 12, 0, 0)
    expect(isSameDay(date.getTime(), date)).toBe(true)
  })
})

// ===== Time zone / 时区语义 =====
// 测试进程默认被固定为 `TZ=Etc/UTC`（见 vitest.config.ts），而本地日与 UTC 日只有在非 UTC 时区下
// 才会产生差异，因此这里用 `vi.stubEnv('TZ', ...)` 临时切换时区（Node >= 16 / V8 9.4 支持运行时切换），
// 并在 `afterEach` 中统一还原。
describe('date > isSameDay (local time zone)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should run on a runtime that honours runtime TZ changes', () => {
    vi.stubEnv('TZ', 'Asia/Shanghai')
    expect(new Date(0).getTimezoneOffset()).toBe(-480)
  })

  it('should compare the local calendar day instead of the UTC day (UTC+8)', () => {
    vi.stubEnv('TZ', 'Asia/Shanghai')
    // 2024-01-14T16:00:00Z === 2024-01-15 00:00 (UTC+8)
    // 2024-01-15T15:59:00Z === 2024-01-15 23:59 (UTC+8) → 同一天（UTC 日不同）
    expect(isSameDay('2024-01-14T16:00:00Z', '2024-01-15T15:59:00Z')).toBe(true)
    // 2024-01-15T16:00:00Z === 2024-01-16 00:00 (UTC+8) → 跨日（UTC 日相同）
    expect(isSameDay('2024-01-14T16:00:00Z', '2024-01-15T16:00:00Z')).toBe(false)
  })

  it('should compare the local calendar day instead of the UTC day (UTC-5)', () => {
    vi.stubEnv('TZ', 'America/New_York')
    // 2024-01-15T04:59:00Z === 2024-01-14 23:59 (EST) → 与 05:00Z (= 01-15 00:00) 不同天（UTC 日相同）
    expect(isSameDay('2024-01-15T04:59:00Z', '2024-01-15T05:00:00Z')).toBe(false)
    // 2024-01-15T05:00:00Z === 2024-01-15 00:00 (EST)
    // 2024-01-16T04:59:00Z === 2024-01-15 23:59 (EST) → 同一天（UTC 日不同）
    expect(isSameDay('2024-01-15T05:00:00Z', '2024-01-16T04:59:00Z')).toBe(true)
  })
})

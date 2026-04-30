import { describe, expect, it } from 'vitest'
import { isSameDay } from './is-same-day'

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

  it('should parse ISO date strings as local time consistent with Date constructor', () => {
    expect(isSameDay('2024-01-01', new Date(2024, 0, 1))).toBe(true)
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

  it('should compare ISO date strings correctly with local Date objects', () => {
    expect(isSameDay(new Date(2024, 0, 15), '2024-01-15')).toBe(true)
  })
})

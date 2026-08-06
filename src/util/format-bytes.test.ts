import { describe, expect, it } from 'vitest'
import { formatBytes } from './format-bytes.js'

describe('util > format-bytes', () => {
  it('should format zero as 0 B', () => {
    expect(formatBytes(0)).toBe('0B')
  })

  it('should format values below the base without decimals', () => {
    expect(formatBytes(999)).toBe('999B')
    expect(formatBytes(1023, { binary: true })).toBe('1023B')
  })

  it('should format the exact base boundary with one decimal', () => {
    expect(formatBytes(1000)).toBe('1.0KB')
    expect(formatBytes(1024, { binary: true })).toBe('1.0KiB')
  })

  it('should climb the decimal unit ladder', () => {
    expect(formatBytes(1e3)).toBe('1.0KB')
    expect(formatBytes(1e6)).toBe('1.0MB')
    expect(formatBytes(1e9)).toBe('1.0GB')
    expect(formatBytes(1e12)).toBe('1.0TB')
    expect(formatBytes(1e15)).toBe('1.0PB')
  })

  it('should climb the binary unit ladder', () => {
    expect(formatBytes(1024 ** 1, { binary: true })).toBe('1.0KiB')
    expect(formatBytes(1024 ** 2, { binary: true })).toBe('1.0MiB')
    expect(formatBytes(1024 ** 3, { binary: true })).toBe('1.0GiB')
    expect(formatBytes(1024 ** 4, { binary: true })).toBe('1.0TiB')
    expect(formatBytes(1024 ** 5, { binary: true })).toBe('1.0PiB')
  })

  it('should respect the precision option', () => {
    expect(formatBytes(1536, { precision: 0 })).toBe('2KB')
    expect(formatBytes(1536, { precision: 2 })).toBe('1.54KB')
    expect(formatBytes(1572864, { precision: 3 })).toBe('1.573MB')
  })

  it('should respect the whitespace option', () => {
    expect(formatBytes(1536, { whitespace: true })).toBe('1.5 KB')
    expect(formatBytes(1536, { precision: 2, whitespace: true })).toBe('1.54 KB')
    expect(formatBytes(1572864, { precision: 3, whitespace: true })).toBe('1.573 MB')
  })

  it('should round to the nearest digit at default precision', () => {
    expect(formatBytes(1572864)).toBe('1.6MB')
    expect(formatBytes(1572864, { binary: true })).toBe('1.5MiB')
  })

  it('should throw RangeError for negative numbers', () => {
    expect(() => formatBytes(-1)).toThrow(RangeError)
    expect(() => formatBytes(-1)).toThrow('bytes must be a finite non-negative number')
  })

  it('should throw RangeError for NaN', () => {
    expect(() => formatBytes(Number.NaN)).toThrow(RangeError)
  })

  it('should throw RangeError for Infinity', () => {
    expect(() => formatBytes(Number.POSITIVE_INFINITY)).toThrow(RangeError)
    expect(() => formatBytes(Number.NEGATIVE_INFINITY)).toThrow(RangeError)
  })

  it('should treat -0 as zero', () => {
    expect(formatBytes(-0)).toBe('0B')
  })

  it('should stay at the largest unit for huge values', () => {
    expect(formatBytes(1e18)).toBe('1000.0PB')
    expect(formatBytes(2 ** 60, { binary: true })).toBe('1024.0PiB')
  })

  it('should not mutate the options object', () => {
    const options = { precision: 2, binary: true }
    formatBytes(1024, options)
    expect(options).toEqual({ precision: 2, binary: true })
  })
})

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { throttle } from './throttle'

describe('function > throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should throttle function execution', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn)

    throttled()
    throttled()
    throttled()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(50)

    throttled()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(60)

    throttled()

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should not execute immediately when noLeading is true', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn, { noLeading: true })

    throttled()
    throttled()
    throttled()

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should execute immediately when noLeading is false (default)', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn, { noLeading: false })

    throttled()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not execute trailing callback when noTrailing is true', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn, { noTrailing: true })

    throttled()
    throttled()

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not execute both leading and trailing when noLeading and noTrailing are both true', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn, { noLeading: true, noTrailing: true })

    throttled()

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(fn).not.toHaveBeenCalled()

    throttled()

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(fn).not.toHaveBeenCalled()
  })

  it('should pass arguments to callback', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn)

    throttled('arg1', 'arg2')

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('should preserve this context', () => {
    const context = { value: 42 }
    const fn = vi.fn(function (this: any) {
      expect(this).toBe(context)
    })
    const throttled = throttle(100, fn)

    throttled.call(context)

    expect(fn).toHaveBeenCalled()
  })

  it('should have cancel method', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn)

    throttled()

    ;(throttled as any).cancel()

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)

    throttled()

    ;(throttled as any).cancel({ upcomingOnly: true })

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should handle zero delay', () => {
    const fn = vi.fn()
    const throttled = throttle(0, fn)

    throttled()
    throttled()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should handle debounce mode', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn, { debounceMode: true })

    throttled()
    throttled()
    throttled()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)

    throttled()
    throttled()

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should execute trailing callback after last call', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn)

    throttled()

    vi.advanceTimersByTime(50)

    throttled()

    vi.advanceTimersByTime(150)

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should reset after delay when noLeading is true', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn, { noLeading: true })

    throttled()

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)

    throttled()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(50)

    throttled()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(60)

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should handle noLeading with elapsed > delay (line 156)', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn, { noLeading: true, noTrailing: false })

    // First call
    throttled()
    expect(fn).not.toHaveBeenCalled() // noLeading = true

    // Advance past delay
    vi.advanceTimersByTime(150)

    // Should execute trailing callback
    expect(fn).toHaveBeenCalledTimes(1)

    // Call again immediately
    throttled()
    expect(fn).toHaveBeenCalledTimes(1) // Still no leading

    // Advance past delay again
    vi.advanceTimersByTime(150)
    expect(fn).toHaveBeenCalledTimes(2) // Trailing execution
  })

  it('should handle cancel with options parameter (line 95)', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn)

    throttled()
    throttled()

    // Cancel with default options (upcomingOnly=false)
    ;(throttled as any).cancel({})
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1) // Only first call executed

    // Further calls should not work (cancelled=true)
    throttled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should execute trailing callback when noLeading and debounceMode are both true', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn, { noLeading: true, debounceMode: true })

    // First call: noLeading prevents leading exec, trailing schedules exec
    throttled()
    expect(fn).not.toHaveBeenCalled()

    // After delay, trailing exec fires
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)

    // Call again
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    // Trailing exec fires again after delay
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should handle cancel with no arguments (line 95 options || {})', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn)

    throttled()
    throttled()

    // Cancel with undefined - options || {} should use {}
    ;(throttled as any).cancel(undefined)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should handle cancel with upcomingOnly=true', () => {
    const fn = vi.fn()
    const throttled = throttle(50, fn)

    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    // Advance past delay so elapsed > delay
    vi.advanceTimersByTime(60)

    throttled()
    expect(fn).toHaveBeenCalledTimes(2)

    // Cancel upcoming only
    ;(throttled as any).cancel({ upcomingOnly: true })

    // Advance and call again - should work since cancelled=false
    vi.advanceTimersByTime(60)
    throttled()
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('should execute callback immediately after cancel({ upcomingOnly: true }) in debounce at-begin mode', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn, { debounceMode: true })

    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    ;(throttled as any).cancel({ upcomingOnly: true })

    throttled()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should throw RangeError when delay is NaN', () => {
    const fn = vi.fn()
    expect(() => throttle(Number.NaN, fn)).toThrow(RangeError)
    expect(() => throttle(Number.NaN, fn)).toThrow('delay must be a finite non-negative number')
  })

  it('should throw RangeError when delay is negative', () => {
    const fn = vi.fn()
    expect(() => throttle(-1, fn)).toThrow(RangeError)
    expect(() => throttle(-1, fn)).toThrow('delay must be a finite non-negative number')
  })

  it('should throw RangeError when delay is Infinity', () => {
    const fn = vi.fn()
    expect(() => throttle(Number.POSITIVE_INFINITY, fn)).toThrow(RangeError)
    expect(() => throttle(Number.POSITIVE_INFINITY, fn)).toThrow(
      'delay must be a finite non-negative number',
    )
  })
})

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
})

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from './debounce'

describe('function > debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should debounce function execution at end (default)', async () => {
    const fn = vi.fn()
    const debounced = debounce(100, fn)

    debounced()
    debounced()
    debounced()

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should debounce function execution at beginning when atBegin is true', async () => {
    const fn = vi.fn()
    const debounced = debounce(100, fn, { atBegin: true })

    debounced()
    debounced()
    debounced()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should pass arguments to callback', () => {
    const fn = vi.fn()
    const debounced = debounce(100, fn)

    debounced('arg1', 'arg2')

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('should preserve this context', () => {
    const context = { value: 42 }
    const fn = vi.fn(function (this: any) {
      expect(this).toBe(context)
    })
    const debounced = debounce(100, fn)

    debounced.call(context)

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalled()
  })

  it('should have cancel method', () => {
    const fn = vi.fn()
    const debounced = debounce(100, fn)

    debounced()
    ;(debounced as any).cancel()

    vi.advanceTimersByTime(100)

    expect(fn).not.toHaveBeenCalled()
  })

  it('should handle zero delay', () => {
    const fn = vi.fn()
    const debounced = debounce(0, fn)

    debounced()

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(0)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should throw RangeError when delay is negative', () => {
    const fn = vi.fn()
    expect(() => debounce(-100, fn)).toThrow(RangeError)
  })

  it('should throw RangeError when delay is Infinity', () => {
    const fn = vi.fn()
    expect(() => debounce(Infinity, fn)).toThrow(RangeError)
    expect(() => debounce(-Infinity, fn)).toThrow(RangeError)
  })

  it('should throw RangeError when delay is NaN', () => {
    const fn = vi.fn()
    expect(() => debounce(Number.NaN, fn)).toThrow(RangeError)
  })

  it('should handle concurrent debounced functions', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const debounced1 = debounce(100, fn1)
    const debounced2 = debounce(100, fn2)

    debounced1()
    debounced2()

    vi.advanceTimersByTime(100)

    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
  })

  it('should re-trigger after delay period with atBegin=true', () => {
    const fn = vi.fn()
    const debounced = debounce(100, fn, { atBegin: true })

    debounced()
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)

    debounced()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should use last call arguments when debouncing', () => {
    const fn = vi.fn()
    const debounced = debounce(100, fn)

    debounced('first')
    debounced('second')
    debounced('third')

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('third')
  })

  it('should resume normal behavior after cancel with upcomingOnly', () => {
    const fn = vi.fn()
    const debounced = debounce(100, fn)

    debounced()
    ;(debounced as any).cancel({ upcomingOnly: true })

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(0)

    debounced('after-cancel')
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('after-cancel')
  })
})

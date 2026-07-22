import { afterEach, describe, expect, it, vi } from 'vitest'
import { timing } from './timing'

describe('util > timing', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return a number', () => {
    const timer = timing()
    expect(typeof timer()).toBe('number')
  })

  it('should return a non-negative value', () => {
    const timer = timing()
    expect(timer()).toBeGreaterThanOrEqual(0)
  })

  it('should return increasing values on multiple calls', () => {
    vi.useFakeTimers()

    const timer = timing()
    const t1 = timer()
    vi.advanceTimersByTime(10)
    const t2 = timer()
    expect(t2).toBeGreaterThanOrEqual(t1)
  })

  it('should measure elapsed time with fake timers', () => {
    vi.useFakeTimers()

    const timer = timing()
    vi.advanceTimersByTime(50)

    const elapsed = timer()
    expect(elapsed).toBeGreaterThanOrEqual(50)
    expect(elapsed).toBeLessThan(51)
  })

  it('should support multiple independent timers', () => {
    vi.useFakeTimers()

    const timer1 = timing()
    vi.advanceTimersByTime(30)
    const timer2 = timing()

    const t1 = timer1()
    const t2 = timer2()

    expect(t1).toBeGreaterThan(t2)
  })

  it('should return consistent results when called rapidly', () => {
    vi.useFakeTimers()

    const timer = timing()
    const results = Array.from({ length: 100 }, () => {
      vi.advanceTimersByTime(1)
      return timer()
    })
    for (let i = 1; i < results.length; i++) {
      expect(results[i]!).toBeGreaterThanOrEqual(results[i - 1]!)
    }
  })

  it('should support timer reuse after reading', () => {
    vi.useFakeTimers()

    const timer = timing()
    vi.advanceTimersByTime(20)
    const t1 = timer()

    vi.advanceTimersByTime(20)
    const t2 = timer()

    expect(t2).toBeGreaterThan(t1)
  })

  it('should use performance.now when available', () => {
    expect(typeof performance.now).toBe('function')

    const timer = timing()
    const elapsed = timer()
    expect(typeof elapsed).toBe('number')
  })

  it('should not throw in any environment', () => {
    expect(() => timing()).not.toThrow()
    const timer = timing()
    expect(() => timer()).not.toThrow()
  })
})

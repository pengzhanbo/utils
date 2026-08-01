import { performance } from 'node:perf_hooks'
import { describe, expect, it, vi } from 'vitest'
import { TimeoutError } from '../error/TimeoutError'
import { until } from './until'

// These tests deliberately exercise `until` against the real platform clock: the
// function under test is a polling primitive built on real `setTimeout` timers,
// and its contract (poll interval, timeout deadline, abort during polling) is
// defined in wall-clock time. Deterministic fake timers cannot validate that
// contract without reimplementing it. Intervals are kept small (10ms) to stay fast.
describe('promise > until', () => {
  it('resolves immediately when the condition is already true', async () => {
    const start = performance.now()
    await until(() => true, { interval: 10 })
    const elapsed = performance.now() - start

    expect(elapsed).toBeLessThan(50)
  })

  it('resolves after the condition becomes true', async () => {
    let count = 0
    const promise = until(
      () => {
        count++
        return count >= 3
      },
      { interval: 10 },
    )

    await expect(promise).resolves.toBeUndefined()

    expect(count).toBe(3)
  })

  it('supports async conditions', async () => {
    let count = 0
    const promise = until(
      async () => {
        count++
        return Promise.resolve(count >= 2)
      },
      { interval: 10 },
    )

    await expect(promise).resolves.toBeUndefined()

    expect(count).toBe(2)
  })

  it('rejects with TimeoutError when the timeout elapses', async () => {
    const promise = until(() => false, { timeout: 30, interval: 10 })

    await expect(promise).rejects.toBeInstanceOf(TimeoutError)
    await expect(promise).rejects.toThrow('The operation was timed out')
  })

  it('rejects with AbortError when aborted during polling', async () => {
    const controller = new AbortController()
    const { signal } = controller
    const promise = until(() => false, { interval: 10, signal })

    setTimeout(() => controller.abort(), 30)

    await expect(promise).rejects.toBeInstanceOf(DOMException)
  })

  it('rejects immediately if the signal is already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    const condition = vi.fn(() => false)

    const promise = until(() => condition(), { signal: controller.signal })

    await expect(promise).rejects.toBeInstanceOf(DOMException)
    expect(condition).not.toHaveBeenCalled()
  })

  it('throws RangeError when interval is negative', async () => {
    await expect(until(() => true, { interval: -1 })).rejects.toThrow(RangeError)
    await expect(until(() => true, { interval: -1 })).rejects.toThrow(
      'interval must be a non-negative number',
    )
  })

  it('works with an interval of 0', async () => {
    let count = 0
    const promise = until(
      () => {
        count++
        return count >= 2
      },
      { interval: 0 },
    )

    await expect(promise).resolves.toBeUndefined()

    expect(count).toBe(2)
  })

  it('propagates errors thrown by the condition', async () => {
    const error = new Error('boom')
    const promise = until(() => {
      throw error
    })

    await expect(promise).rejects.toBe(error)
  })

  it('propagates rejections of an async condition', async () => {
    const error = new Error('async boom')
    const promise = until(async () => {
      throw error
    })

    await expect(promise).rejects.toBe(error)
  })
})

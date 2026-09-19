import { describe, expect, it, vi } from 'vitest'
import { sleep } from '../promise/sleep.js'
import { limitAsync } from './limit-async.js'
import { Semaphore } from './semaphore.js'

describe('promise > limitAsync', () => {
  it('limits concurrency of async callbacks', async () => {
    let running = 0
    let maxRunning = 0

    const callback = vi.fn(async () => {
      running++

      if (running > maxRunning) {
        maxRunning = running
      }
      await sleep(30)

      running--
    })

    const limitedCallback = limitAsync(callback, 2)

    await Promise.all([
      limitedCallback(),
      limitedCallback(),
      limitedCallback(),
      limitedCallback(),
      limitedCallback(),
    ])

    expect(maxRunning).toBeLessThanOrEqual(2)
    expect(callback).toHaveBeenCalledTimes(5)
  })

  it('returns correct values in correct order', async () => {
    const callback = vi.fn(async (item: number) => item)

    const limitedCallback = limitAsync(callback, 3)

    const results = await Promise.all([
      limitedCallback(3),
      limitedCallback(1),
      limitedCallback(4),
      limitedCallback(2),
    ])

    expect(results).toEqual([3, 1, 4, 2])

    expect(callback).toHaveBeenCalledTimes(4)
    expect(callback.mock.calls[0]![0]).toBe(3)
    expect(callback.mock.calls[1]![0]).toBe(1)
    expect(callback.mock.calls[2]![0]).toBe(4)
    expect(callback.mock.calls[3]![0]).toBe(2)
  })

  it('propagates callback errors', async () => {
    const callback = vi.fn(async (item: number) => {
      if (item === 2) {
        throw new Error('fail')
      }
      return item
    })

    const limitedCallback = limitAsync(callback, 2)

    await expect(
      Promise.all([limitedCallback(1), limitedCallback(2), limitedCallback(3)]),
    ).rejects.toThrow('fail')
  })

  it('should throw RangeError for non-positive concurrency', () => {
    expect(() => limitAsync(async () => 1, 0)).toThrow(RangeError)
    expect(() => limitAsync(async () => 1, 0)).toThrow('concurrency must be a positive integer')
    expect(() => limitAsync(async () => 1, -1)).toThrow(RangeError)
    expect(() => limitAsync(async () => 1, 1.5)).toThrow(RangeError)
  })

  it('keeps the limit and releases permits when callbacks reject', async () => {
    let running = 0
    let maxRunning = 0
    let finished = 0

    const callback = vi.fn(async (item: number) => {
      running++
      if (running > maxRunning) {
        maxRunning = running
      }
      await sleep(10)
      running--
      finished++
      if (item % 3 === 0) {
        throw new Error(`fail ${item}`)
      }
      return item
    })

    const limitedCallback = limitAsync(callback, 2)

    const results = await Promise.allSettled(
      Array.from({ length: 10 }, (_, index) => limitedCallback(index)),
    )

    expect(maxRunning).toBeLessThanOrEqual(2)
    expect(callback).toHaveBeenCalledTimes(10)
    expect(finished).toBe(10)
    expect(running).toBe(0)
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(6)
    expect(results.filter((result) => result.status === 'rejected')).toHaveLength(4)

    // every permit was restored: a fresh burst can still run two at a time
    maxRunning = 0
    await Promise.allSettled(Array.from({ length: 10 }, (_, index) => limitedCallback(100 + index)))
    expect(maxRunning).toBe(2)
  })

  it('keeps the limit on the mixed fast-path and queued-path calls', async () => {
    const instances: Semaphore[] = []
    const originalTryAcquire = Semaphore.prototype.tryAcquire
    const tryAcquireSpy = vi
      .spyOn(Semaphore.prototype, 'tryAcquire')
      .mockImplementation(function captureSemaphore(this: Semaphore) {
        if (!instances.includes(this)) {
          instances.push(this)
        }
        return originalTryAcquire.call(this)
      })

    let running = 0
    let maxRunning = 0

    const limitedCallback = limitAsync(async () => {
      running++
      if (running > maxRunning) {
        maxRunning = running
      }
      await sleep(10)
      running--
    }, 2)

    // warm up once so the internal semaphore instance is captured
    await limitedCallback()
    const semaphore = instances[0]!
    const release = semaphore.tryAcquire()
    expect(release).toBeTypeOf('function')
    expect(semaphore.available).toBe(1)

    tryAcquireSpy.mockRestore()

    // one permit is held outside, so only a single call may run at a time
    await Promise.all(Array.from({ length: 6 }, () => limitedCallback()))

    expect(maxRunning).toBe(1)
    expect(running).toBe(0)

    release!()
    expect(semaphore.available).toBe(2)
  })
})

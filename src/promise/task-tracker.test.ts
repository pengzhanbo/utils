import { describe, expect, it, vi } from 'vitest'
import { sleep } from './sleep.js'
import { createTaskTracker } from './task-tracker.js'

describe('promise > createTaskTracker', () => {
  it('tracks in-flight tasks', async () => {
    const tracker = createTaskTracker()
    const fn = vi.fn(async () => sleep(100))

    expect(tracker.isRunning()).toBe(false)

    void tracker.run(fn)

    expect(tracker.isRunning()).toBe(true)

    await tracker.wait()

    expect(tracker.isRunning()).toBe(false)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('resolves with the task result', async () => {
    const tracker = createTaskTracker()

    await expect(tracker.run(async () => 42)).resolves.toBe(42)
  })

  it('propagates task rejections', async () => {
    const tracker = createTaskTracker()

    await expect(
      tracker.run(async () => {
        throw new Error('boom')
      }),
    ).rejects.toThrow('boom')
  })

  it('wait() resolves even when a tracked task rejects', async () => {
    const tracker = createTaskTracker()
    const task = tracker.run(async () => {
      throw new Error('boom')
    })

    await expect(task).rejects.toThrow('boom')
    await expect(tracker.wait()).resolves.toBeUndefined()
  })

  it('runs tasks concurrently (not a mutex)', async () => {
    const tracker = createTaskTracker()
    const events: string[] = []
    const first = tracker.run(async () => {
      events.push('start 1')
      await sleep(30)
      events.push('end 1')
    })
    const second = tracker.run(async () => {
      events.push('start 2')
      await sleep(10)
      events.push('end 2')
    })

    await Promise.all([first, second])

    // The second task starts before the first finishes, proving no serialization.
    expect(events).toEqual(['start 1', 'start 2', 'end 2', 'end 1'])
  })

  it('wait() only waits for tasks in-flight at call time', async () => {
    const tracker = createTaskTracker()
    let firstDone = false
    let secondDone = false
    const first = tracker.run(async () => {
      await sleep(20)
      firstDone = true
    })
    const waiting = tracker.wait()
    const second = tracker.run(async () => {
      await sleep(60)
      secondDone = true
    })

    await waiting

    expect(firstDone).toBe(true)
    expect(secondDone).toBe(false)

    await second

    expect(secondDone).toBe(true)
  })

  it('clear() forgets tracked tasks without cancelling them', async () => {
    const tracker = createTaskTracker()
    let done = false
    const task = tracker.run(async () => {
      await sleep(30)
      done = true
    })

    tracker.clear()

    expect(tracker.isRunning()).toBe(false)
    await tracker.wait()
    expect(done).toBe(false)

    await task
    expect(done).toBe(true)
  })
})

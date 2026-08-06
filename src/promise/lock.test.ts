import { describe, expect, it, vi } from 'vitest'
import { createPromiseLock } from './lock.js'
import { sleep } from './sleep.js'

describe('promise > createPromiseLock', () => {
  it('should work', async () => {
    const lock = createPromiseLock()
    const fn = vi.fn(async () => sleep(100))

    expect(lock.isWaiting()).toBe(false)

    void lock.run(fn)

    expect(lock.isWaiting()).toBe(true)

    await lock.wait()

    expect(lock.isWaiting()).toBe(false)

    expect(fn).toHaveBeenCalledTimes(1)

    lock.clear()

    expect(lock.isWaiting()).toBe(false)
  })
})

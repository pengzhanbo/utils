import { describe, expect, it, vi } from 'vitest'
import { createPromiseLock } from './lock'
import { sleep } from '.'

describe('promise > createPromiseLock', () => {
  it('should work', async () => {
    const lock = createPromiseLock()
    const fn = vi.fn(() => sleep(100))

    expect(lock.isWaiting()).toBe(false)

    lock.run(fn)

    expect(lock.isWaiting()).toBe(true)

    await lock.wait()

    expect(lock.isWaiting()).toBe(false)

    expect(fn).toHaveBeenCalledTimes(1)

    lock.clear()

    expect(lock.isWaiting()).toBe(false)
  })
})

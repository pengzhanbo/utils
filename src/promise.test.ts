import { describe, expect, it, vi } from 'vitest'
import { range } from './array'
import { random } from './math'
import {
  createControlledPromise,
  createPromiseLock,
  createSingletonPromise,
  promiseParallel,
  promiseParallelSettled,
  Semaphore,
  sleep,
  timeout,
  withTimeout,
} from './promise'

describe('promise > promiseParallel', () => {
  it('should work with empty array', async () => {
    await expect(promiseParallel([])).resolves.toEqual([])
  })
  it('should work with default', async () => {
    await expect(
      promiseParallel(
        range(5).map((_, i) => Promise.resolve(i)),
      ),
    ).resolves.toEqual([0, 1, 2, 3, 4])
  })
  it('should work with all promises fulfilled', async () => {
    const start = performance.now()
    await expect(
      promiseParallel(
        range(5).map((_, i) => async () => {
          await sleep(range(100, 900, 100)[random(9)]!)
          return i
        }),
        5,
      ),
    ).resolves.toEqual([0, 1, 2, 3, 4])
    expect(performance.now() - start).toBeLessThan(1000)
  })

  it('should work with some promises rejected', async () => {
    await expect(
      promiseParallel(
        [
          () => Promise.resolve(1),
          () => Promise.reject(new Error('error')),
          () => Promise.resolve(2),
        ],
        2,
      ),
    ).rejects.toThrowError('error')
  })
})

describe('promise > promiseParallelSettled', () => {
  it('should work with empty array', async () => {
    await expect(promiseParallelSettled([])).resolves.toEqual([])
  })
  it('should work with all promises fulfilled', async () => {
    await expect(promiseParallelSettled(range(5).map(() => Promise.resolve(1))))
      .resolves
      .toEqual(range(5).map(() => ({ status: 'fulfilled', value: 1 })))
  })

  it('should work with some promises rejected', async () => {
    await expect(
      promiseParallelSettled([...range(7).map(async (i) => {
        await sleep(i * 10)
        return i
      }), () => Promise.reject(new Error('error'))], 4),
    ).resolves.toEqual(
      [...range(7).map(i => ({ status: 'fulfilled', value: i })), { status: 'rejected', reason: new Error('error') }],
    )
  })
})

describe('promise > timeout', () => {
  it('should work', async () => {
    await expect(timeout(1000)).rejects.toThrowError('The operation was timed out')
  })
})

describe('promise > withTimeout', () => {
  it('should work without timeout', async () => {
    await expect(withTimeout(() => Promise.resolve(1), 1000)).resolves.toBe(1)
  })

  it('should work with timeout', async () => {
    await expect(withTimeout(() => sleep(1000), 100)).rejects.toThrowError('The operation was timed out')
  })
})

describe('promise > createSingletonPromise', () => {
  it('should work', async () => {
    let counter = 0

    const promise = createSingletonPromise(async () => {
      await sleep(10)
      counter++
      return counter
    })

    expect(counter).toBe(0)

    await promise()
    expect(counter).toBe(1)

    await promise()
    expect(counter).toBe(1)

    expect(await promise()).toBe(1)

    promise.reset()

    expect(await promise()).toBe(2)
  })

  it('should work with reset', async () => {
    let counter = 0

    const promise = createSingletonPromise(async () => {
      await sleep(10)
      counter++
      return counter
    })
    promise.reset()
    await promise()
    expect(await promise()).toBe(1)
  })
})

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

describe('promise > createControlledPromise', () => {
  it('should work', async () => {
    const promise = createControlledPromise()
    promise.then(data => data)

    promise.resolve(1)

    expect(await promise).toBe(1)
  })
})

describe('promise > Semaphore', () => {
  it('should allow acquisition when a permit is available', async () => {
    const sema = new Semaphore(1)

    await expect(sema.acquire()).resolves.toBeUndefined()
  })

  it('should not allow acquisition when no permits are available', async () => {
    const sema = new Semaphore(1)

    await sema.acquire()

    const spy = vi.fn()

    sema.acquire().then(spy)

    await sleep(0)

    expect(spy).not.toHaveBeenCalled()
  })

  it('should allow acquisition after a permit is released before the call', async () => {
    const sema = new Semaphore(1)

    await sema.acquire()
    sema.release()

    await expect(sema.acquire()).resolves.toBeUndefined()
  })

  it('should allow acquisition after a permit is released after the call', async () => {
    const sema = new Semaphore(1)

    await sema.acquire()

    const spy = vi.fn()

    sema.acquire().then(spy)

    sema.release()

    await sleep(100)

    expect(spy).toBeCalledTimes(1)
  })

  it('should resolve requests in the order they were made when permits are released', async () => {
    const semaphore = new Semaphore(2)

    await semaphore.acquire()
    await semaphore.acquire()

    const spy1 = vi.fn()
    const spy2 = vi.fn()

    semaphore.acquire().then(spy1)
    semaphore.acquire().then(spy2)

    await sleep(0)

    expect(spy1).not.toHaveBeenCalled()
    expect(spy2).not.toHaveBeenCalled()

    semaphore.release()

    await sleep(0)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).not.toHaveBeenCalled()

    await sleep(0)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).not.toHaveBeenCalledTimes(1)
  })

  it('should not allow acquiring more permits than the capacity', async () => {
    const semaphore = new Semaphore(1)

    semaphore.acquire()
    semaphore.acquire()

    semaphore.release()
    semaphore.release()

    const spy1 = vi.fn()
    const spy2 = vi.fn()

    semaphore.acquire().then(spy1)
    semaphore.acquire().then(spy2)

    await sleep(0)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).not.toHaveBeenCalled()
  })

  it('should not increase available permits beyond capacity when releasing without pending tasks', () => {
    const semaphore = new Semaphore(2)

    expect(semaphore.available).toBe(2)

    semaphore.release()
    expect(semaphore.available).toBe(2)

    semaphore.release()
    expect(semaphore.available).toBe(2)
  })
})

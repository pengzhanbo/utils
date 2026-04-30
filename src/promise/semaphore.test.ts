import { describe, expect, it, vi } from 'vitest'
import { Semaphore } from './semaphore'
import { sleep } from './sleep'

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

  it('should throw RangeError when capacity is 0', () => {
    expect(() => new Semaphore(0)).toThrow(RangeError)
    expect(() => new Semaphore(0)).toThrow('Semaphore capacity must be a positive integer')
  })

  it('should throw RangeError when capacity is negative', () => {
    expect(() => new Semaphore(-1)).toThrow(RangeError)
    expect(() => new Semaphore(-5)).toThrow(RangeError)
  })

  it('should throw RangeError when capacity is not an integer', () => {
    expect(() => new Semaphore(1.5)).toThrow(RangeError)
    expect(() => new Semaphore(0.5)).toThrow(RangeError)
  })

  it('should throw RangeError when capacity is NaN or Infinity', () => {
    expect(() => new Semaphore(Number.NaN)).toThrow(RangeError)
    expect(() => new Semaphore(Number.POSITIVE_INFINITY)).toThrow(RangeError)
  })

  it('should not inflate available permits with excess release calls', async () => {
    const semaphore = new Semaphore(2)

    semaphore.release()
    semaphore.release()
    semaphore.release()

    expect(semaphore.available).toBe(2)

    await semaphore.acquire()
    await semaphore.acquire()

    expect(semaphore.available).toBe(0)

    semaphore.release()
    semaphore.release()
    semaphore.release()

    expect(semaphore.available).toBe(2)
  })

  it('should not exceed capacity after over-release', async () => {
    const semaphore = new Semaphore(2)

    semaphore.release()
    semaphore.release()
    semaphore.release()

    const spy1 = vi.fn()
    const spy2 = vi.fn()
    const spy3 = vi.fn()

    semaphore.acquire().then(spy1)
    semaphore.acquire().then(spy2)
    semaphore.acquire().then(spy3)

    await sleep(0)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).not.toHaveBeenCalled()
  })

  it('should maintain FIFO order with linked list queue', async () => {
    const semaphore = new Semaphore(1)

    await semaphore.acquire()

    const order: number[] = []
    const spy1 = vi.fn(() => order.push(1))
    const spy2 = vi.fn(() => order.push(2))
    const spy3 = vi.fn(() => order.push(3))

    semaphore.acquire().then(spy1)
    semaphore.acquire().then(spy2)
    semaphore.acquire().then(spy3)

    await sleep(0)

    semaphore.release()
    await sleep(0)

    semaphore.release()
    await sleep(0)

    semaphore.release()
    await sleep(0)

    expect(order).toEqual([1, 2, 3])
  })
})

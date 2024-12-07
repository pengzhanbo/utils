import { describe, expect, it } from 'vitest'
import { range } from './array'
import { random } from './math'
import { promiseParallel, promiseParallelSettled, sleep, timeout, withTimeout } from './promise'

describe('promise parallel', () => {
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
          await sleep(range(100, 1000, 100)[random(9)])
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

describe('promise parallel settled', () => {
  it('should work with all promises fulfilled', async () => {
    await expect(promiseParallelSettled(range(5).map(() => Promise.resolve(1))))
      .resolves
      .toEqual(range(5).map(() => ({ status: 'fulfilled', value: 1 })))
  })

  it('should work with some promises rejected', async () => {
    await expect(
      promiseParallelSettled([...range(7).map(async (i) => {
        await sleep(i * 100)
        return i
      }), () => Promise.reject(new Error('error'))], 4),
    ).resolves.toEqual(
      [...range(7).map(i => ({ status: 'fulfilled', value: i })), { status: 'rejected', reason: new Error('error') }],
    )
  })
})

describe('timeout', () => {
  it('should work', async () => {
    await expect(timeout(1000)).rejects.toThrowError('The operation was timed out')
  })
})

describe('withTimeout', () => {
  it('should work without timeout', async () => {
    await expect(withTimeout(() => Promise.resolve(1), 1000)).resolves.toBe(1)
  })

  it('should work with timeout', async () => {
    await expect(withTimeout(() => sleep(1000), 100)).rejects.toThrowError('The operation was timed out')
  })
})

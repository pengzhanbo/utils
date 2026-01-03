import { describe, expect, it } from 'vitest'
import { range } from '../array/range'
import { random } from '../math'
import { promiseParallel, promiseParallelSettled } from './parallel'
import { sleep } from './sleep'

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

import { describe, expect, it } from 'vitest'
import { range } from '../array/range'
import { random } from '../math'
import { promiseParallel, promiseParallelSettled } from './parallel'
import { sleep } from './sleep'

describe('promise > promiseParallel', () => {
  it('should throw RangeError for non-positive concurrency', () => {
    expect(() => promiseParallel([], 0)).toThrow(RangeError)
    expect(() => promiseParallel([], -1)).toThrow(RangeError)
    expect(() => promiseParallel([], 1.5)).toThrow(RangeError)
  })
  it('should work with empty array', async () => {
    await expect(promiseParallel([])).resolves.toEqual([])
  })
  it('should work with default', async () => {
    await expect(promiseParallel(range(5).map((_, i) => Promise.resolve(i)))).resolves.toEqual([
      0, 1, 2, 3, 4,
    ])
  })
  it('should work with all promises fulfilled', async () => {
    const start = performance.now()
    await expect(
      promiseParallel(
        range(5).map((_, i) => async () => {
          await sleep(range(100, 900, 100)[random(8)]!)
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

  it('should execute sequentially with concurrency=1', async () => {
    const order: number[] = []
    await promiseParallel(
      [0, 1, 2].map(
        (i) => () =>
          new Promise<number>((resolve) => {
            order.push(i)
            resolve(i)
          }),
      ),
      1,
    )
    expect(order).toEqual([0, 1, 2])
  })

  it('should work when concurrency exceeds array length', async () => {
    await expect(
      promiseParallel(
        [0, 1, 2].map((i) => Promise.resolve(i)),
        100,
      ),
    ).resolves.toEqual([0, 1, 2])
  })

  it('should work with mixed Promise values and function factories', async () => {
    await expect(
      promiseParallel([Promise.resolve(1), () => Promise.resolve(2)], 2),
    ).resolves.toEqual([1, 2])
  })

  it('should not start remaining promises after rejection', async () => {
    const started: number[] = []
    const promises = [0, 1, 2, 3, 4].map(
      (i) => () =>
        new Promise<number>((resolve, reject) => {
          started.push(i)
          if (i === 1) {
            reject(new Error('reject'))
          } else {
            resolve(i)
          }
        }),
    )
    await expect(promiseParallel(promises, 2)).rejects.toThrow('reject')
    expect(started.length).toBeLessThan(5)
  })
})

describe('promise > promiseParallelSettled', () => {
  it('should throw RangeError for non-positive concurrency', () => {
    expect(() => promiseParallelSettled([], 0)).toThrow(RangeError)
    expect(() => promiseParallelSettled([], -1)).toThrow(RangeError)
    expect(() => promiseParallelSettled([], 1.5)).toThrow(RangeError)
  })
  it('should work with empty array', async () => {
    await expect(promiseParallelSettled([])).resolves.toEqual([])
  })
  it('should work with all promises fulfilled', async () => {
    await expect(promiseParallelSettled(range(5).map(() => Promise.resolve(1)))).resolves.toEqual(
      range(5).map(() => ({ status: 'fulfilled', value: 1 })),
    )
  })

  it('should work with some promises rejected', async () => {
    await expect(
      promiseParallelSettled(
        [
          ...range(7).map(async (i) => {
            await sleep(i * 10)
            return i
          }),
          () => Promise.reject(new Error('error')),
        ],
        4,
      ),
    ).resolves.toEqual([
      ...range(7).map((i) => ({ status: 'fulfilled', value: i })),
      { status: 'rejected', reason: new Error('error') },
    ])
  })

  it('should handle all promises rejected', async () => {
    const result = await promiseParallelSettled(
      [() => Promise.reject(new Error('err1')), () => Promise.reject(new Error('err2'))],
      2,
    )
    expect(result).toEqual([
      { status: 'rejected', reason: new Error('err1') },
      { status: 'rejected', reason: new Error('err2') },
    ])
  })

  it('should execute sequentially with concurrency=1', async () => {
    const order: number[] = []
    await promiseParallelSettled(
      [0, 1, 2].map(
        (i) => () =>
          new Promise<number>((resolve) => {
            order.push(i)
            resolve(i)
          }),
      ),
      1,
    )
    expect(order).toEqual([0, 1, 2])
  })
})

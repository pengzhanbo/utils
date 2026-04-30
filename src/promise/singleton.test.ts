import { describe, expect, it } from 'vitest'
import { createSingletonPromise } from './singleton'
import { sleep } from './sleep'

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

  it('should not throw when reset is called after rejected promise', async () => {
    let callCount = 0
    const promise = createSingletonPromise(async () => {
      callCount++
      if (callCount === 1) throw new Error('first call failed')
      return 'success'
    })

    await promise().catch(() => {})
    await expect(promise.reset()).resolves.toBeUndefined()
    const result = await promise()
    expect(result).toBe('success')
  })

  it('should allow retry after rejected promise via reset', async () => {
    let shouldFail = true
    const promise = createSingletonPromise(async () => {
      if (shouldFail) {
        shouldFail = false
        throw new Error('fail')
      }
      return 'ok'
    })

    await promise().catch(() => {})
    await promise.reset()
    expect(await promise()).toBe('ok')
  })

  it('should not execute fn concurrently when wrapper is called during reset await', async () => {
    let concurrentCount = 0
    let maxConcurrent = 0
    let callCount = 0

    const promise = createSingletonPromise(async () => {
      concurrentCount++
      if (concurrentCount > maxConcurrent) maxConcurrent = concurrentCount
      callCount++
      await sleep(50)
      concurrentCount--
      return callCount
    })

    const p1 = promise()
    const resetPromise = promise.reset()
    const p2 = promise()

    await Promise.all([p1, resetPromise, p2])

    expect(maxConcurrent).toBe(1)
    expect(callCount).toBe(2)
  })

  it('should return same promise when wrapper is called during resetting', async () => {
    let callCount = 0

    const promise = createSingletonPromise(async () => {
      callCount++
      await sleep(50)
      return callCount
    })

    const p1 = promise()
    const resetPromise = promise.reset()
    const p2 = promise()
    const p3 = promise()

    expect(p2).toBe(p3)

    await Promise.all([p1, resetPromise, p2])
  })

  it('should wait for previous promise to settle before creating new one during reset', async () => {
    const order: string[] = []

    const promise = createSingletonPromise(async () => {
      order.push('fn-start')
      await sleep(30)
      order.push('fn-end')
      return 'result'
    })

    const p1 = promise()
    const resetPromise = promise.reset()
    const p2 = promise()

    const results = await Promise.all([p1, resetPromise, p2])

    expect(results[0]).toBe('result')
    expect(results[2]).toBe('result')
    expect(order).toEqual(['fn-start', 'fn-end', 'fn-start', 'fn-end'])
  })
})

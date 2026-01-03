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
})

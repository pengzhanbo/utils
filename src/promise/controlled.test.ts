import { describe, expect, it } from 'vitest'
import { createControlledPromise } from './controlled.js'

describe('promise > createControlledPromise', () => {
  it('should work', async () => {
    const promise = createControlledPromise()
    promise.then((data) => data).catch(() => {})

    promise.resolve(1)

    expect(await promise).toBe(1)
  })
})

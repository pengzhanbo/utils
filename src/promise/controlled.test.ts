import { describe, expect, it } from 'vitest'
import { createControlledPromise } from './controlled'

describe('promise > createControlledPromise', () => {
  it('should work', async () => {
    const promise = createControlledPromise()
    promise.then(data => data)

    promise.resolve(1)

    expect(await promise).toBe(1)
  })
})

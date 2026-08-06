import { describe, expect, it } from 'vitest'
import { attempt } from './attempt.js'

describe('util > attempt', () => {
  it('should return the result of the function', () => {
    expect(attempt(() => 1)).toEqual([null, 1])
  })

  it('should return the result of the function with args', () => {
    const add = (a: number, b: number) => a + b
    expect(attempt(add, 1, 2)).toEqual([null, 3])
  })

  it('should return the error of the function', () => {
    expect(
      attempt(() => {
        throw new Error('test')
      }),
    ).toEqual([new Error('test'), null])
  })

  it('should return the result of the promise', async () => {
    // oxlint-disable-next-line typescript/require-await
    const [error, result] = attempt(async () => 1)
    expect(error).toBeNull()
    expect(await result).toBe(1)
  })

  it('should wrap non-Error thrown objects', () => {
    const [error, result] = attempt(() => {
      // eslint-disable-next-line no-throw-literal typescript/only-throw-error
      throw 'string error'
    })
    expect(error).toBeInstanceOf(Error)
    expect(error instanceof Error && error.message).toBe('string error')
    expect(result).toBeNull()
  })
})

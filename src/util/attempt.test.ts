import { describe, expect, it } from 'vitest'
import { attempt } from './attempt'

describe('util > attempt', () => {
  it('should return the result of the function', () => {
    expect(attempt(() => 1)).toEqual([null, 1])
  })

  it('should return the result of the function with args', async () => {
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
    const [error, result] = attempt(async () => 1)
    expect(error).toBeNull()
    expect(await result).toBe(1)
  })
})

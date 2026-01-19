import { describe, expect, it, vi } from 'vitest'
import { retry } from './retry'

describe('functions > retry', () => {
  it('should work', async () => {
    const limit = 3
    const fn = vi.fn(() => Promise.reject(new Error('error')))
    await expect(retry(fn, { limit, delay: 0 })).rejects.toThrowError('error')
    expect(fn).toHaveBeenCalledTimes(limit)
  })

  it('should work with once resolve', async () => {
    const fn = vi.fn(() => Promise.resolve(1))
    const result = await retry(fn)
    expect(result).toBe(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should work with less than limit resolve', async () => {
    const limit = 4
    let attempts = 0
    const fn = vi.fn(() => {
      attempts++
      if (attempts < limit) {
        return Promise.reject(new Error('error'))
      }
      return Promise.resolve(1)
    })
    const result = await retry(fn, { limit: 5 })
    expect(result).toBe(1)
    expect(fn).toHaveBeenCalledTimes(limit)
  })
})

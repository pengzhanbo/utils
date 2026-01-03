import { describe, expect, it } from 'vitest'
import { sleep } from './sleep'
import { timeout, withTimeout } from './timeout'

describe('promise > timeout', () => {
  it('should work', async () => {
    await expect(timeout(1000)).rejects.toThrowError('The operation was timed out')
  })
})

describe('promise > withTimeout', () => {
  it('should work without timeout', async () => {
    await expect(withTimeout(() => Promise.resolve(1), 1000)).resolves.toBe(1)
  })

  it('should work with timeout', async () => {
    await expect(withTimeout(() => sleep(1000), 100)).rejects.toThrowError('The operation was timed out')
  })
})

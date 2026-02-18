import { describe, expect, it } from 'vitest'
import { timestamp } from './timestamp'

describe('date > timestamp', () => {
  it('should return current timestamp in milliseconds', () => {
    const result = timestamp()
    expect(result).toBeTypeOf('number')
    expect(result).toBeGreaterThan(0)
  })

  it('should return a consistent timestamp within the same execution context', () => {
    const now = Date.now()
    const result = timestamp()
    expect(result).toBeGreaterThanOrEqual(now)
    expect(result).toBeLessThanOrEqual(now + 100)
  })

  it('should return timestamp close to Date.now()', () => {
    const before = Date.now()
    const result = timestamp()
    const after = Date.now()
    expect(result).toBeGreaterThanOrEqual(before)
    expect(result).toBeLessThanOrEqual(after)
  })
})

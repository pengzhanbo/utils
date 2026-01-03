import { describe, expect, it } from 'vitest'
import { inRange } from './in-range'

describe('inRange', () => {
  it('should return true if the number is in range [min, max]', () => {
    expect(inRange(2, 1, 3)).toBe(true)
    expect(inRange(6, 1, 3)).toBe(false)
    expect(inRange(3, 5)).toBe(true)
    expect(inRange(6, 5)).toBe(false)
  })
})

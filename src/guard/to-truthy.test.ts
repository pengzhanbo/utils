import { describe, expect, it } from 'vitest'
import { toTruthy } from './to-truthy'

describe('guard > toTruthy', () => {
  it('should work', () => {
    expect(toTruthy(1)).toBe(true)
    expect(toTruthy(0)).toBe(false)
  })

  it('should work with filter', () => {
    expect([1, 2, 3, '', false, undefined].filter(toTruthy)).toEqual([1, 2, 3])
  })
})

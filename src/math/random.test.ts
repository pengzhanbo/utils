import { describe, expect, it } from 'vitest'
import { random } from './random'

describe('math > random', () => {
  it('should work', () => {
    expect(random(1, 2)).toBeGreaterThanOrEqual(1)
    expect(random(1, 2)).toBeLessThanOrEqual(2)
    expect(random(1, 2, true)).toBeGreaterThanOrEqual(1)
    expect(random(1, 2, true)).toBeLessThanOrEqual(2)

    expect(random(1)).toBeGreaterThanOrEqual(0)
    expect(random(1)).toBeLessThanOrEqual(1)

    expect(random(1, true)).toBeGreaterThanOrEqual(0)
    expect(random(1, true)).toBeLessThanOrEqual(1)
  })
})

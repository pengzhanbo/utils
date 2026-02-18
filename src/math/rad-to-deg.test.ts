import { describe, expect, it } from 'vitest'
import { radToDeg } from './rad-to-deg'

describe('math > radToDeg', () => {
  it('should convert radians to degrees correctly', () => {
    expect(radToDeg(0)).toBe(0)
    expect(radToDeg(Math.PI)).toBe(180)
    expect(radToDeg(Math.PI / 2)).toBe(90)
    expect(radToDeg(Math.PI / 4)).toBe(45)
    expect(radToDeg(2 * Math.PI)).toBe(360)
  })

  it('should handle negative radians', () => {
    expect(radToDeg(-Math.PI)).toBe(-180)
    expect(radToDeg(-Math.PI / 2)).toBe(-90)
  })

  it('should handle floating-point radians', () => {
    expect(radToDeg(1)).toBeCloseTo(57.29577951308232)
  })

  it('should handle NaN input', () => {
    expect(radToDeg(Number.NaN)).toBeNaN()
  })

  it('should handle Infinity input', () => {
    expect(radToDeg(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY)
    expect(radToDeg(Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY)
  })
})

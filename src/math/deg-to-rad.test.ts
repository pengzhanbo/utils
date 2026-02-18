import { describe, expect, it } from 'vitest'
import { degToRad } from './deg-to-rad'

describe('math > degToRad', () => {
  it('should convert degrees to radians correctly', () => {
    expect(degToRad(0)).toBe(0)
    expect(degToRad(180)).toBe(Math.PI)
    expect(degToRad(90)).toBe(Math.PI / 2)
    expect(degToRad(45)).toBe(Math.PI / 4)
    expect(degToRad(360)).toBe(2 * Math.PI)
  })

  it('should handle negative degrees', () => {
    expect(degToRad(-180)).toBe(-Math.PI)
    expect(degToRad(-90)).toBe(-Math.PI / 2)
  })

  it('should handle floating-point degrees', () => {
    expect(degToRad(57.29577951308232)).toBeCloseTo(1)
  })

  it('should handle NaN input', () => {
    expect(degToRad(Number.NaN)).toBeNaN()
  })

  it('should handle Infinity input', () => {
    expect(degToRad(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY)
    expect(degToRad(Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY)
  })
})

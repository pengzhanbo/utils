import { describe, expect, it } from 'vitest'
import { clamp } from './clamp'

describe('math > clamp', () => {
  it('should work', () => {
    expect(clamp(2, 1, 3)).toEqual(2)
    expect(clamp(1, 2, 3)).toEqual(2)
    expect(clamp(4, 1, 3)).toEqual(3)
  })

  it('should swap min and max when min > max', () => {
    expect(clamp(5, 10, 1)).toEqual(5)
  })
})

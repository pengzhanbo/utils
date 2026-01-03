import { describe, expect, it } from 'vitest'
import { pick } from './pick'

describe('object > pick', () => {
  it('should work', () => {
    expect(pick({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 })
    expect(pick({ a: 1, b: 2 }, ['a', 'b', 'c'] as any)).toEqual({ a: 1, b: 2 })
  })
})

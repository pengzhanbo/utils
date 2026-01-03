import { describe, expect, it } from 'vitest'
import { omit } from './omit'

describe('object > omit', () => {
  it('should work', () => {
    expect(omit({ a: 1, b: 2 }, ['a'])).toEqual({ b: 2 })
    expect(omit({ a: 1, b: 2 }, ['a', 'b', 'c'] as any)).toEqual({})
  })
})

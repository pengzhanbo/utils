import { describe, expect, it } from 'vitest'
import { objectKeys } from './keys'

describe('object > objectKeys', () => {
  it('should work', () => {
    expect(objectKeys({ a: 1, b: 2 })).toEqual(['a', 'b'])
  })
})

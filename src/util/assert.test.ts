import { describe, expect, it } from 'vitest'
import { assert } from './assert'

describe('util > assert', () => {
  it('should throw error', () => {
    expect(() => assert(false)).toThrow()
  })

  it('should not throw error', () => {
    expect(() => assert(true)).not.toThrow()
  })
})

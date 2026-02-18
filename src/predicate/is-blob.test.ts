import { describe, expect, it } from 'vitest'
import { isBlob } from './is-blob'

describe('predicate > isBlob', () => {
  it('should work', () => {
    expect(isBlob(undefined)).toBe(false)
    expect(isBlob(null)).toBe(false)
    expect(isBlob(1)).toBe(false)
    expect(isBlob('1')).toBe(false)
    expect(isBlob(true)).toBe(false)
    expect(isBlob(false)).toBe(false)
    expect(isBlob({})).toBe(false)
    expect(isBlob(() => {})).toBe(false)
    expect(isBlob(new Blob([]))).toBe(true)
  })
})

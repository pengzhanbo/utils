import { describe, expect, it } from 'vitest'
import { deleteKey } from './delete-key'

describe('deleteKey', () => {
  it('should delete a single key', () => {
    const obj = { a: 1, b: 2 }
    expect(deleteKey(obj, 'a')).toBe(true)
    expect(obj).toEqual({ b: 2 })
    expect('a' in obj).toBe(false)
  })

  it('should return true even if key does not exist (single key)', () => {
    const obj = { a: 1 }
    // Reflect.deleteProperty returns true if property doesn't exist
    expect(deleteKey(obj, 'b' as any)).toBe(true)
    expect(obj).toEqual({ a: 1 })
  })

  it('should delete multiple keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(deleteKey(obj, ['a', 'c'])).toBe(true)
    expect(obj).toEqual({ b: 2 })
  })

  it('should handle mixed existing and non-existing keys in array', () => {
    const obj = { a: 1, b: 2 }
    expect(deleteKey(obj, ['a', 'c'] as any)).toBe(true)
    expect(obj).toEqual({ b: 2 })
  })

  it('should return false for empty array', () => {
    const obj = { a: 1 }
    expect(deleteKey(obj, [])).toBe(false)
    expect(obj).toEqual({ a: 1 })
  })
})

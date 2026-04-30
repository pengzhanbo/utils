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

  it('should return false when all keys in array are non-configurable and deletion fails', () => {
    const obj = {}
    Object.defineProperty(obj, 'a', { value: 1, configurable: false })
    expect(deleteKey(obj, ['a'] as any)).toBe(false)
  })

  it('should return true when at least one key in array is successfully deleted', () => {
    const obj: any = { a: 1, b: 2 }
    Object.defineProperty(obj, 'c', { value: 3, configurable: false })
    expect(deleteKey(obj, ['a', 'c'] as any)).toBe(true)
    expect(obj.a).toBeUndefined()
  })
})

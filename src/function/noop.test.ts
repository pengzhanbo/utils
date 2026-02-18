import { describe, expect, it } from 'vitest'
import { noop } from './noop'

describe('function > noop', () => {
  it('should return undefined', () => {
    const result = noop()
    expect(result).toBeUndefined()
  })

  it('should not throw any error when called with arguments', () => {
    expect(() => (noop as any)(1, 2, 3)).not.toThrow()
    expect(() => (noop as any)('a', 'b')).not.toThrow()
    expect(() => (noop as any)({}, [], null)).not.toThrow()
  })

  it('should not throw any error when called with no arguments', () => {
    expect(() => noop()).not.toThrow()
  })

  it('should work in various contexts', () => {
    const arr = [1, 2, 3]
    const mapped = arr.map(noop)
    expect(mapped).toEqual([undefined, undefined, undefined])

    const obj = { fn: noop }
    expect(obj.fn()).toBeUndefined()
  })

  it('should be callable multiple times without side effects', () => {
    expect(noop()).toBeUndefined()
    expect(noop()).toBeUndefined()
    expect(noop()).toBeUndefined()
  })
})

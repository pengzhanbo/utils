import { describe, expect, it, vi } from 'vitest'
import { once } from './once'

describe('functions > once', () => {
  it('should work', () => {
    const fn = vi.fn()
    const onceFn = once(fn)
    onceFn()
    onceFn()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should work with once', () => {
    let id = 1
    const fn = vi.fn(() => id++)
    const onceFn = once(fn)
    onceFn()
    onceFn()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(id).toBe(2)
  })

  it('should work with arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b)
    const onceFn = once(fn)
    onceFn(1, 2)
    onceFn(1, 2)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(1, 2)
  })

  it('should allow retry when the first call throws an error', () => {
    let callCount = 0
    const fn = vi.fn(() => {
      callCount++
      if (callCount === 1) throw new Error('first call failed')
      return 'success'
    })
    const onceFn = once(fn)

    expect(() => onceFn()).toThrow('first call failed')
    expect(fn).toHaveBeenCalledTimes(1)

    const result = onceFn()
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should return cached result after successful call', () => {
    let callCount = 0
    const fn = vi.fn(() => {
      callCount++
      return callCount
    })
    const onceFn = once(fn)

    const result1 = onceFn()
    const result2 = onceFn()
    const result3 = onceFn()

    expect(result1).toBe(1)
    expect(result2).toBe(1)
    expect(result3).toBe(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not cache result from a failed call', () => {
    let shouldFail = true
    const fn = vi.fn(() => {
      if (shouldFail) {
        shouldFail = false
        throw new Error('fail')
      }
      return 'ok'
    })
    const onceFn = once(fn)

    expect(() => onceFn()).toThrow('fail')
    expect(onceFn()).toBe('ok')
    expect(onceFn()).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should preserve this context when used on object methods', () => {
    const obj = {
      value: 42,
      getValue(this: { value: number }) {
        return this.value
      },
    }
    const onceGetValue = once(obj.getValue)

    expect(onceGetValue.call(obj)).toBe(42)
    expect(onceGetValue.call(obj)).toBe(42)
  })
})

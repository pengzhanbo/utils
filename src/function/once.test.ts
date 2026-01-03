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
})

import { describe, expect, it, vi } from 'vitest'
import { invoke } from './invoke'

describe('function invoke', () => {
  it('should work with once', () => {
    const fn = vi.fn()
    invoke(fn)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should work with multiple functions', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    invoke([fn1, fn2, fn2])
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(2)
  })

  it('should work with arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b)
    invoke(fn, 1, 2)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(1, 2)
  })

  it('should work with multiple functions and arguments', () => {
    const fn1 = vi.fn((a: number, b: number) => a + b)
    const fn2 = vi.fn((a: number, b: number) => a - b)
    invoke([fn1, fn2], 1, 2)
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn1).toHaveBeenCalledWith(1, 2)
    expect(fn2).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledWith(1, 2)
  })
})

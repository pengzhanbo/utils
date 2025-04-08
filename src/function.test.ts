import { describe, expect, it, vi } from 'vitest'
import { compose, invoke, once } from './function'

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

describe('invoke', () => {
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
})

describe('compose', () => {
  function add(a: number, b: number) {
    return a + b
  }

  function multiply(a: number) {
    return a * 2
  }

  function subtract(a: number) {
    return a - 1
  }

  it('should work', () => {
    expect(compose()(1, 2)).toEqual([1, 2])
    expect(compose(add)(1, 2)).toBe(3)
    expect(compose(multiply, add)(1, 2)).toBe(6)
    expect(compose(subtract, add)(1, 2)).toBe(2)
    expect(compose(subtract, multiply, add)(1, 2)).toBe(5)
  })
})

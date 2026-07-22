import { describe, expect, it, vi } from 'vitest'
import { tap } from './tap'

describe('function > tap', () => {
  describe('tap(value, fn)', () => {
    it('should return the original value', () => {
      expect(tap(42, () => {})).toBe(42)
    })

    it('should execute the side-effect function with the value', () => {
      const fn = vi.fn()
      tap('hello', fn)
      expect(fn).toHaveBeenCalledOnce()
      expect(fn).toHaveBeenCalledWith('hello')
    })

    it('should ignore the return value of the side-effect', () => {
      const result = tap('original', () => 'ignored')
      expect(result).toBe('original')
    })

    it('should pass through null', () => {
      const fn = vi.fn()
      expect(tap(null, fn)).toBeNull()
      expect(fn).toHaveBeenCalledWith(null)
    })

    it('should pass through undefined', () => {
      const fn = vi.fn()
      expect(tap(undefined, fn)).toBeUndefined()
      expect(fn).toHaveBeenCalledWith(undefined)
    })

    it('should pass through zero', () => {
      const fn = vi.fn()
      expect(tap(0, fn)).toBe(0)
      expect(fn).toHaveBeenCalledWith(0)
    })

    it('should pass through an empty string', () => {
      const fn = vi.fn()
      expect(tap('', fn)).toBe('')
      expect(fn).toHaveBeenCalledWith('')
    })

    it('should pass through an object reference', () => {
      const obj = { a: 1 }
      const fn = vi.fn()
      expect(tap(obj, fn)).toBe(obj)
      expect(fn).toHaveBeenCalledWith(obj)
    })

    it('should propagate errors from the side-effect', () => {
      const error = new Error('side-effect failed')
      expect(() =>
        tap(42, () => {
          throw error
        }),
      ).toThrow(error)
    })
  })

  describe('tap(fn)', () => {
    it('should return a function', () => {
      expect(typeof tap(() => {})).toBe('function')
    })

    it('the returned function should execute the side-effect', () => {
      const fn = vi.fn()
      const tapFn = tap(fn)
      tapFn('hello')
      expect(fn).toHaveBeenCalledOnce()
      expect(fn).toHaveBeenCalledWith('hello')
    })

    it('the returned function should return the value', () => {
      const tapFn = tap(() => {})
      expect(tapFn(42)).toBe(42)
    })

    it('the returned function should ignore the side-effect return', () => {
      const tapFn = tap(() => 'ignored')
      expect(tapFn('original')).toBe('original')
    })

    it('should work as a pipe step', () => {
      const fn = vi.fn()
      const double = (n: number) => n * 2
      const triple = (n: number) => n * 3
      const pipeline = (n: number) => triple(tap(double(n), fn))

      expect(pipeline(5)).toBe(30)
      expect(fn).toHaveBeenCalledWith(10)
    })

    it('should propagate errors from the returned function', () => {
      const error = new Error('tap error')
      const tapFn = tap(() => {
        throw error
      })
      expect(() => tapFn('x')).toThrow(error)
    })
  })
})

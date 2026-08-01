import vm from 'node:vm'
import { describe, expect, it } from 'vitest'
import { isAsyncFunction } from './is-async-function'

describe('predicate > is-async-function', () => {
  it('should return true for async function declarations', () => {
    async function fn() {}
    expect(isAsyncFunction(fn)).toBe(true)
  })

  it('should return true for async arrow functions', () => {
    const fn = async () => {}
    expect(isAsyncFunction(fn)).toBe(true)
  })

  it('should return false for regular functions', () => {
    // oxlint-disable-next-line prefer-arrow-callback
    expect(isAsyncFunction(function () {})).toBe(false)
  })

  it('should return false for arrow functions', () => {
    expect(isAsyncFunction(() => {})).toBe(false)
  })

  it('should return false for generator functions', () => {
    function* fn() {}
    expect(isAsyncFunction(fn)).toBe(false)
  })

  it('should return false for async generator functions', () => {
    async function* fn() {}
    expect(isAsyncFunction(fn)).toBe(false)
  })

  it('should return false for classes', () => {
    class Foo {}
    expect(isAsyncFunction(Foo)).toBe(false)
  })

  it('should return false for class instances', () => {
    class Foo {}
    expect(isAsyncFunction(new Foo())).toBe(false)
  })

  it('should return false for objects with async methods', () => {
    const obj = {
      async method() {},
    }
    expect(isAsyncFunction(obj)).toBe(false)
  })

  it('should return false for null', () => {
    expect(isAsyncFunction(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isAsyncFunction(undefined)).toBe(false)
  })

  it('should return false for strings', () => {
    expect(isAsyncFunction('async')).toBe(false)
  })

  it('should return false for numbers', () => {
    expect(isAsyncFunction(1)).toBe(false)
  })

  it('should return false for booleans', () => {
    expect(isAsyncFunction(true)).toBe(false)
  })

  it('should return false for symbols', () => {
    expect(isAsyncFunction(Symbol('async'))).toBe(false)
  })

  it('should return false for promises', () => {
    expect(isAsyncFunction(Promise.resolve())).toBe(false)
  })

  it('should detect async functions from other realms (cross-realm safe)', () => {
    const crossRealmAsync = vm.runInNewContext('(async () => {})')
    const crossRealmFunction = vm.runInNewContext('(function () {})')
    expect(isAsyncFunction(crossRealmAsync)).toBe(true)
    expect(isAsyncFunction(crossRealmFunction)).toBe(false)
  })

  it('should narrow the type to an async function', async () => {
    const value: unknown = async () => 'hello'
    if (isAsyncFunction(value)) {
      expect(await value()).toBe('hello')
    } else {
      throw new Error('expected value to be narrowed to an async function')
    }
  })
})

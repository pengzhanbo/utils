import { describe, expect, it } from 'vitest'
import { deferred } from './deferred'

describe('promise > deferred', () => {
  it('should return an object with promise, resolve, reject', () => {
    const d = deferred()
    expect(d).toHaveProperty('promise')
    expect(d).toHaveProperty('resolve')
    expect(d).toHaveProperty('reject')
  })

  it('should return a Promise for the promise property', () => {
    const d = deferred()
    expect(d.promise).toBeInstanceOf(Promise)
  })

  it('should resolve the promise when resolve is called', async () => {
    const d = deferred<number>()
    d.resolve(42)
    await expect(d.promise).resolves.toBe(42)
  })

  it('should reject the promise when reject is called', async () => {
    const d = deferred()
    d.reject(new Error('fail'))
    await expect(d.promise).rejects.toThrow('fail')
  })

  it('should reject with a non-Error value', async () => {
    const d = deferred<string>()
    d.reject('string reason')
    await expect(d.promise).rejects.toBe('string reason')
  })

  it('should resolve with a PromiseLike value', async () => {
    const d = deferred<number>()
    d.resolve(Promise.resolve(10))
    await expect(d.promise).resolves.toBe(10)
  })

  it('should ignore redundant resolve calls (first wins)', async () => {
    const d = deferred<number>()
    d.resolve(1)
    d.resolve(2)
    await expect(d.promise).resolves.toBe(1)
  })

  it('should ignore resolve after reject (first wins)', async () => {
    const d = deferred()
    d.reject(new Error('first'))
    d.resolve(42)
    await expect(d.promise).rejects.toThrow('first')
  })

  it('should ignore reject after resolve (first wins)', async () => {
    const d = deferred<number>()
    d.resolve(99)
    d.reject(new Error('later'))
    await expect(d.promise).resolves.toBe(99)
  })

  it('should support generics for resolved type', async () => {
    const d = deferred<string>()
    d.resolve('hello')
    const result = await d.promise
    expect(typeof result).toBe('string')
    expect(result).toBe('hello')
  })

  it('should await the promise after resolve', async () => {
    const d = deferred<number>()
    setTimeout(() => d.resolve(7), 0)
    const result = await d.promise
    expect(result).toBe(7)
  })

  it('should return undefined from resolve', () => {
    const d = deferred()
    expect(d.resolve(42)).toBeUndefined()
  })

  it('should return undefined from reject', () => {
    const d = deferred()
    d.promise.catch(() => {})
    expect(d.reject(new Error('fail'))).toBeUndefined()
  })
})

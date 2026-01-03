import { describe, expect, it } from 'vitest'
import { deepClone, shallowClone, simpleClone } from './clone'

describe('clone > simpleClone', () => {
  it('should work', () => {
    expect(simpleClone('a')).toEqual('a')
    expect(simpleClone(1)).toEqual(1)
    expect(simpleClone([1])).toEqual([1])
    expect(simpleClone({ a: 1 })).toEqual({ a: 1 })
    expect(simpleClone(false)).toEqual(false)
  })
})

describe('clone > shallowClone', () => {
  it('should clone primitive values', () => {
    expect(shallowClone('')).toEqual('')
    expect(shallowClone(1)).toEqual(1)
    expect(shallowClone(true)).toEqual(true)
    expect(shallowClone(null)).toEqual(null)
    expect(shallowClone(undefined)).toEqual(undefined)

    const symbol = Symbol('symbol')
    expect(shallowClone(symbol)).toEqual(symbol)
  })

  it('should clone reference values', () => {
    expect(shallowClone({ a: 1 })).toEqual({ a: 1 })
    expect(shallowClone([{ a: 1 }])).toEqual([{ a: 1 }])
    const d = new Date()
    expect(shallowClone(d)).toEqual(d)
    expect(shallowClone(new ArrayBuffer(1))).toEqual(new ArrayBuffer(1))
    expect(shallowClone(new SharedArrayBuffer(1))).toEqual(new SharedArrayBuffer(1))
    expect(shallowClone(/a/)).toEqual(/a/)
    expect(shallowClone(new DataView(new ArrayBuffer(1)))).toEqual(new DataView(new ArrayBuffer(1)))
    const file = new File(['a'], 'a')
    expect(shallowClone(file)).toEqual(file)
  })

  it('should clone Error', () => {
    const error = new Error('Error Message', { cause: 'Unknown' })
    const clonedError = shallowClone(error)

    expect(clonedError).toEqual(error)
    expect(clonedError).not.toBe(error)
    expect(clonedError).toBeInstanceOf(Error)

    expect(clonedError.message).toBe(error.message)
    expect(clonedError.stack).toBe(error.stack)
    expect(clonedError.name).toBe(error.name)
    expect(clonedError.cause).toBe(error.cause)
  })

  it('should clone Custom Error', () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message)
        this.name = 'CustomError'
      }
    }

    const error = new CustomError('Error Message')
    const clonedError = shallowClone(error)

    expect(clonedError).toEqual(error)
    expect(clonedError).not.toBe(error)
    expect(clonedError).toBeInstanceOf(CustomError)

    expect(clonedError.message).toBe(error.message)
    expect(clonedError.name).toBe(error.name)
  })
})

describe('clone > deepClone', () => {
  it('deepClone', () => {
    expect(deepClone('')).toBe('')
    expect(deepClone(1)).toBe(1)
    expect(deepClone(true)).toBe(true)
    expect(deepClone(null)).toBe(null)
    expect(deepClone(undefined)).toBe(undefined)
    expect(deepClone([1])).toEqual([1])
    const symbol = Symbol('a')
    expect(deepClone(symbol)).toBe(symbol)
    const d = new Date()
    expect(deepClone(d)).toEqual(d)
    expect(deepClone(new ArrayBuffer(1))).toEqual(new ArrayBuffer(1))
    expect(deepClone(new SharedArrayBuffer(1))).toEqual(new SharedArrayBuffer(1))
    expect(deepClone(/a/)).toEqual(/a/)
    expect(deepClone(/test/.exec('hello test'))).toEqual(/test/.exec('hello test'))
    expect(deepClone(new DataView(new ArrayBuffer(1)))).toEqual(new DataView(new ArrayBuffer(1)))
    // 在 ci 中可能会由于时间戳不同导致不相等
    // expect(deepClone(new File(['a'], 'a'))).toEqual(new File(['a'], 'a'))
    expect(deepClone({ a: 1 })).toEqual({ a: 1 })
    expect(deepClone({ a: { b: { c: 1 } } })).toEqual({ a: { b: { c: 1 } } })
    expect(deepClone([{ a: { b: { c: 1 } } }])).toEqual([{ a: { b: { c: 1 } } }])
    expect(deepClone(new Set([1]))).toEqual(new Set([1]))
    expect(deepClone(new Map([['a', 1]]))).toEqual(new Map([['a', 1]]))
    // eslint-disable-next-line node/prefer-global/buffer
    expect(deepClone(Buffer.from('a'))).toEqual(Buffer.from('a'))
    expect(deepClone(new Uint8Array([1]))).toEqual(new Uint8Array([1]))
    expect(deepClone(new Int8Array([1]))).toEqual(new Int8Array([1]))
    expect(deepClone(new Uint16Array([1]))).toEqual(new Uint16Array([1]))
    expect(deepClone(new Int16Array([1]))).toEqual(new Int16Array([1]))
    expect(deepClone(new Uint32Array([1]))).toEqual(new Uint32Array([1]))
    expect(deepClone(new Int32Array([1]))).toEqual(new Int32Array([1]))
    expect(deepClone(new Float32Array([1]))).toEqual(new Float32Array([1]))
    expect(deepClone(new Float64Array([1]))).toEqual(new Float64Array([1]))
    expect(deepClone(new Blob(['a']))).toEqual(new Blob(['a']))
  })

  it('should clone Error', () => {
    const error = new Error('Error Message', { cause: 'Unknown' })
    const clonedError = deepClone(error)

    expect(clonedError).toEqual(error)
    expect(clonedError).not.toBe(error)
    expect(clonedError).toBeInstanceOf(Error)

    expect(clonedError.message).toBe(error.message)
    expect(clonedError.stack).toBe(error.stack)
    expect(clonedError.name).toBe(error.name)
    expect(clonedError.cause).toBe(error.cause)
  })

  it('should clone Custom Error', () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message)
        this.name = 'CustomError'
      }
    }

    const error = new CustomError('Something went wrong')
    const clonedError = deepClone(error)

    expect(clonedError).toEqual(error)
    expect(clonedError).not.toBe(error)
    expect(clonedError).toBeInstanceOf(CustomError)

    expect(clonedError.message).toBe(error.message)
    expect(clonedError.name).toBe(error.name)
  })
})

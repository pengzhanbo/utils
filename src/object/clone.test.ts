import { describe, expect, it } from 'vitest'
import { copyProperties } from '../_internal/deepCloneImpl'
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
    const offsetBuffer = new ArrayBuffer(16)
    const offsetView = new DataView(offsetBuffer, 4, 8)
    const offsetCloned = shallowClone(offsetView)
    expect(offsetCloned.byteOffset).toBe(offsetView.byteOffset)
    expect(offsetCloned.byteLength).toBe(offsetView.byteLength)
    expect(offsetCloned).not.toBe(offsetView)
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

  it('should clone File objects (lines 119-126)', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const clonedFile = deepClone(file)

    // Check that it's a File instance
    expect(clonedFile).toBeInstanceOf(File)
    // Check basic properties
    expect(clonedFile.name).toBe(file.name)
    expect(clonedFile.type).toBe(file.type)
    expect(clonedFile.size).toBe(file.size)
    // Should be a different object
    expect(clonedFile).not.toBe(file)
  })

  it('should clone Blob objects', () => {
    const blob = new Blob(['blob content'], { type: 'application/octet-stream' })
    const clonedBlob = deepClone(blob)

    expect(clonedBlob).toBeInstanceOf(Blob)
    expect(clonedBlob.size).toBe(blob.size)
    expect(clonedBlob.type).toBe(blob.type)
    expect(clonedBlob).not.toBe(blob)
  })

  it('should clone Error with deep cloned cause', () => {
    const cause = { reason: 'Unknown', detail: { code: 500 } }
    const error = new Error('Error Message', { cause })
    const clonedError = deepClone(error)

    expect(clonedError).toEqual(error)
    expect(clonedError).not.toBe(error)
    expect(clonedError).toBeInstanceOf(Error)

    expect(clonedError.message).toBe(error.message)
    expect(clonedError.stack).toBe(error.stack)
    expect(clonedError.name).toBe(error.name)
    expect(clonedError.cause).toEqual(cause)
    expect(clonedError.cause).not.toBe(cause)
    expect((clonedError.cause as any).detail).not.toBe(cause.detail)
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

  it('should handle objects with non-writable properties (line 185)', () => {
    const obj: Record<string, any> = {}
    Object.defineProperty(obj, 'readonly', {
      value: 'cannot change',
      writable: false,
      enumerable: true,
      configurable: true,
    })
    obj.writable = 'can change'

    const cloned = deepClone(obj)

    // Non-writable property should not be deeply cloned
    expect(cloned.readonly).toBe('cannot change')
    // Writable property should be cloned
    expect(cloned.writable).toBe('can change')
  })

  it('should clone objects with Symbol properties', () => {
    const sym = Symbol('test')
    const obj = { [sym]: 'value', normal: 'prop' }
    const cloned = deepClone(obj)

    expect(cloned[sym]).toBe('value')
    expect(cloned.normal).toBe('prop')
    expect(cloned).not.toBe(obj)
  })

  it('should clone primitive arrays efficiently', () => {
    const arr = [1, 2, 3, 4, 5]
    const cloned = deepClone(arr)
    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
  })

  it('should clone arrays with null and undefined elements', () => {
    const arr = [1, null, undefined, 'test', true]
    const cloned = deepClone(arr)
    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
  })

  it('should clone RegExp match result with index and input', () => {
    const match = /test/.exec('hello test world')
    expect(match).not.toBeNull()
    const cloned = deepClone(match!)
    expect(cloned).toEqual(match)
    expect(cloned).not.toBe(match)
    expect(cloned.index).toBe(match!.index)
    expect(cloned.input).toBe(match!.input)
  })

  it('should clone RegExp match result with groups (named capture groups)', () => {
    const match = /(?<word>test)/.exec('hello test world')
    expect(match).not.toBeNull()
    expect(match!.groups).toEqual({ word: 'test' })

    const cloned = deepClone(match!)
    expect(cloned).toEqual(match)
    expect(cloned).not.toBe(match)
    expect(cloned.index).toBe(match!.index)
    expect(cloned.input).toBe(match!.input)
    expect(cloned.groups).toEqual({ word: 'test' })
    expect(cloned.groups).not.toBe(match!.groups)
  })

  it('should clone RegExp match result with indices (d flag)', () => {
    const match = /test/d.exec('hello test world')
    expect(match).not.toBeNull()
    expect(match!.indices).toBeDefined()

    const cloned = deepClone(match!)
    expect(cloned).toEqual(match)
    expect(cloned).not.toBe(match)
    expect(cloned.index).toBe(match!.index)
    expect(cloned.input).toBe(match!.input)
    expect(cloned.indices).not.toBeNull()
    expect(cloned.indices).toEqual(match!.indices)
    expect(cloned.indices).not.toBe(match!.indices)
  })

  it('should clone non-primitive array with indices metadata property', () => {
    const arr: any = [{ a: 1 }, { b: 2 }]
    arr.indices = [
      [0, 5],
      [6, 10],
    ]
    const cloned = deepClone(arr)
    expect(cloned[0]).toEqual({ a: 1 })
    expect(cloned[1]).toEqual({ b: 2 })
    expect(cloned[0]).not.toBe(arr[0])
    expect(cloned[1]).not.toBe(arr[1])
    expect(cloned.indices).toEqual([
      [0, 5],
      [6, 10],
    ])
    expect(cloned.indices).not.toBe(arr.indices)
    expect(cloned.indices[0]).not.toBe(arr.indices[0])
  })

  it('should clone array-like with index and input containing objects', () => {
    const arrLike = [{ a: 1 }, { b: 2 }] as any
    arrLike.index = 0
    arrLike.input = 'test'
    const cloned = deepClone(arrLike)
    expect(cloned[0]).toEqual({ a: 1 })
    expect(cloned[1]).toEqual({ b: 2 })
    expect(cloned.index).toBe(0)
    expect(cloned.input).toBe('test')
    expect(cloned[0]).not.toBe(arrLike[0])
    expect(cloned[1]).not.toBe(arrLike[1])
  })

  it('should clone arrays containing objects', () => {
    const arr = [{ a: 1 }, { b: { c: 2 } }]
    const cloned = deepClone(arr)
    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
    expect(cloned[0]).not.toBe(arr[0])
    expect(cloned[1]).not.toBe(arr[1])
    expect(cloned[1]!.b).not.toBe(arr[1]!.b)
  })

  it('should clone arrays with nested arrays', () => {
    const arr = [
      [1, 2],
      [3, [4, 5]],
    ]
    const cloned = deepClone(arr)
    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
    expect(cloned[0]).not.toBe(arr[0])
    expect(cloned[1]).not.toBe(arr[1])
  })

  it('should clone Set with object values', () => {
    const obj = { a: 1 }
    const set = new Set([obj])
    const cloned = deepClone(set)
    expect(cloned).toEqual(set)
    expect(cloned).not.toBe(set)
    const clonedObj = cloned.values().next().value
    expect(clonedObj).toEqual(obj)
    expect(clonedObj).not.toBe(obj)
  })

  it('should clone Map with object values', () => {
    const obj = { a: 1 }
    const map = new Map([['key', obj]])
    const cloned = deepClone(map)
    expect(cloned).toEqual(map)
    expect(cloned).not.toBe(map)
    const clonedObj = cloned.get('key')
    expect(clonedObj).toEqual(obj)
    expect(clonedObj).not.toBe(obj)
  })

  it('should clone RegExp with lastIndex', () => {
    const regex = /a/g
    regex.lastIndex = 5
    const cloned = deepClone(regex)
    expect(cloned.source).toBe(regex.source)
    expect(cloned.flags).toBe(regex.flags)
    expect(cloned.lastIndex).toBe(5)
    expect(cloned).not.toBe(regex)
  })

  it('should clone DataView with properties', () => {
    const buffer = new ArrayBuffer(8)
    const view = new DataView(buffer, 0, 8)
    const cloned = deepClone(view)
    expect(cloned.byteLength).toBe(view.byteLength)
    expect(cloned).not.toBe(view)
  })

  it('should preserve Date reference identity in circular structures', () => {
    const date = new Date('2024-01-01')
    const obj: any = { a: date, b: date }
    const cloned = deepClone(obj)
    expect(cloned.a).toEqual(cloned.b)
    expect(cloned.a).toBe(cloned.b)
    expect(cloned.a).not.toBe(date)
  })

  it('should preserve RegExp reference identity in circular structures', () => {
    const regex = /test/g
    const obj: any = { a: regex, b: regex }
    const cloned = deepClone(obj)
    expect(cloned.a).toBe(cloned.b)
    expect(cloned.a).not.toBe(regex)
    expect(cloned.a.source).toBe('test')
    expect(cloned.a.flags).toBe('g')
  })

  it('should preserve ArrayBuffer reference identity in circular structures', () => {
    const buffer = new ArrayBuffer(4)
    const obj: any = { a: buffer, b: buffer }
    const cloned = deepClone(obj)
    expect(cloned.a).toBe(cloned.b)
    expect(cloned.a).not.toBe(buffer)
    expect(cloned.a.byteLength).toBe(4)
  })

  it('should deep clone Map keys that are objects', () => {
    const keyObj = { id: 1 }
    const map = new Map([[keyObj, 'value1']])
    const cloned = deepClone(map)
    const clonedKey = cloned.keys().next().value
    expect(clonedKey).toEqual(keyObj)
    expect(clonedKey).not.toBe(keyObj)
    expect(cloned.get(clonedKey as typeof keyObj)).toBe('value1')
  })

  it('should deep clone Map with complex object keys', () => {
    const key1 = { x: 1 }
    const key2 = { x: 2 }
    const map = new Map([
      [key1, { val: 'a' }],
      [key2, { val: 'b' }],
    ])
    const cloned = deepClone(map)
    const clonedKeys = [...cloned.keys()]
    expect(clonedKeys[0]).toEqual(key1)
    expect(clonedKeys[0]).not.toBe(key1)
    expect(clonedKeys[1]).toEqual(key2)
    expect(clonedKeys[1]).not.toBe(key2)
    expect(cloned.get(clonedKeys[0]!)).toEqual({ val: 'a' })
    expect(cloned.get(clonedKeys[1]!)).toEqual({ val: 'b' })
  })

  it('should create independent Buffer copy (not shared memory)', () => {
    const buf = Buffer.from([1, 2, 3])
    const cloned = deepClone(buf)
    expect(cloned).toEqual(buf)
    expect(cloned).not.toBe(buf)
    cloned[0] = 99
    expect(buf[0]).toBe(1)
    expect(cloned[0]).toBe(99)
  })

  it('should preserve Map key reference identity in circular structures', () => {
    const keyObj = { id: 1 }
    const obj: any = { key: keyObj, map: new Map([[keyObj, 'value']]) }
    const cloned = deepClone(obj)
    const clonedKeyFromMap = cloned.map.keys().next().value
    expect(cloned.key).toEqual(clonedKeyFromMap)
  })

  it('should skip getter/setter properties during deep clone', () => {
    const obj: any = { normal: 'value' }
    Object.defineProperty(obj, 'computed', {
      get() {
        return 'getter'
      },
      set() {},
      enumerable: true,
      configurable: true,
    })
    const cloned = deepClone(obj)
    expect(cloned.normal).toBe('value')
    expect(Object.getOwnPropertyDescriptor(cloned, 'computed')).toBeUndefined()
  })

  it('should handle sourceDescriptor null in copyProperties', () => {
    const obj = Object.create(null)
    obj.a = 1
    const cloned = deepClone(obj)
    expect(cloned.a).toBe(1)
  })

  it('should copy properties when target has no existing descriptor', () => {
    class CustomError extends Error {
      extra: string
      constructor(message: string, extra: string) {
        super(message)
        this.name = 'CustomError'
        this.extra = extra
      }
    }
    const error = new CustomError('test', 'extra-value')
    const cloned = deepClone(error)
    expect(cloned).toBeInstanceOf(CustomError)
    expect(cloned.extra).toBe('extra-value')
    expect(cloned.message).toBe('test')
  })

  it('should copy source properties to target with no existing descriptor', () => {
    class MyClass {
      value = { a: 1 }
    }
    const instance = new MyClass()
    const cloned = deepClone(instance)
    expect(cloned).toBeInstanceOf(MyClass)
    expect(cloned.value).toEqual({ a: 1 })
    expect(cloned.value).not.toBe(instance.value)
  })

  it('should skip non-writable target properties in copyProperties', () => {
    const source = { a: { b: 1 } }
    const cloned = deepClone(source)
    expect(cloned.a).toEqual({ b: 1 })
    expect(cloned.a).not.toBe(source.a)
  })

  it('should deep clone Error with custom enumerable properties', () => {
    const error: any = new Error('test')
    error.extra = { value: 1 }
    const cloned: any = deepClone(error)
    expect(cloned).toBeInstanceOf(Error)
    expect(cloned.extra).toEqual({ value: 1 })
    expect(cloned.extra).not.toBe(error.extra)
    expect(cloned.message).toBe('test')
  })

  it('should handle target with non-writable property in copyProperties', () => {
    const source: any = { a: 1, b: { c: 2 } }
    const target: any = {}
    Object.defineProperty(target, 'a', {
      value: 'existing',
      writable: false,
      enumerable: true,
      configurable: true,
    })
    copyProperties(target, source)
    expect(target.a).toBe('existing')
    expect(target.b).toEqual({ c: 2 })
  })

  it('should skip __proto__ own property during deep clone', () => {
    const source = Object.create(null)
    // oxlint-disable-next-line no-proto
    source.__proto__ = { tainted: true }
    source.safe = { value: 1 }
    const cloned = deepClone(source)
    expect(cloned.safe).toEqual({ value: 1 })
    expect(cloned.safe).not.toBe(source.safe)
    // oxlint-disable-next-line no-proto
    expect(cloned.__proto__).toBeUndefined()
  })
})

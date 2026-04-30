import { describe, expect, it } from 'vitest'
import { deepFreeze } from './deep-freeze'

describe('object > deepFreeze', () => {
  it('should work', () => {
    const obj = { a: 1 }
    deepFreeze(obj)
    expect(() => {
      obj.a = 2
    }).toThrowError()
  })

  it('should work with nested object', () => {
    const obj = { a: { b: 1 } }
    deepFreeze(obj)
    expect(() => {
      obj.a.b = 2
    }).toThrowError()
  })

  it('should work with array', () => {
    const obj = [{ a: { b: 1 } }, { a: { b: 1 } }]
    deepFreeze(obj)
    expect(() => {
      // @ts-expect-error
      obj[1].a.b = 2
    }).toThrowError()
  })

  it('should freeze the array itself so push/splice fail', () => {
    const arr = [1, 2, 3]
    deepFreeze(arr)
    expect(Object.isFrozen(arr)).toBe(true)
    expect(() => {
      arr.push(4)
    }).toThrowError()
    expect(() => {
      arr.splice(0, 1)
    }).toThrowError()
    expect(() => {
      arr[0] = 99
    }).toThrowError()
    expect(arr).toEqual([1, 2, 3])
  })

  it('should freeze nested arrays', () => {
    const obj = { items: [1, 2, 3] }
    deepFreeze(obj)
    expect(Object.isFrozen(obj.items)).toBe(true)
    expect(() => {
      obj.items.push(4)
    }).toThrowError()
  })

  it('should freeze empty array', () => {
    const arr: number[] = []
    deepFreeze(arr)
    expect(Object.isFrozen(arr)).toBe(true)
    expect(() => {
      arr.push(1)
    }).toThrowError()
  })

  it('should freeze Symbol key properties', () => {
    const sym = Symbol('test')
    const obj = { [sym]: { a: 1 } } as any
    deepFreeze(obj)
    expect(Object.isFrozen(obj)).toBe(true)
    expect(() => {
      obj[sym].a = 2
    }).toThrowError()
  })

  it('should handle circular references', () => {
    const obj: any = { a: 1 }
    obj.self = obj
    expect(() => deepFreeze(obj)).not.toThrow()
    expect(Object.isFrozen(obj)).toBe(true)
  })

  it('should freeze non-enumerable properties', () => {
    const obj: any = {}
    Object.defineProperty(obj, 'hidden', {
      value: { a: 1 },
      enumerable: false,
      writable: true,
      configurable: true,
    })
    deepFreeze(obj)
    expect(Object.isFrozen(obj)).toBe(true)
    expect(() => {
      obj.hidden.a = 2
    }).toThrowError()
  })

  it('should skip non-plain object values like Date and RegExp', () => {
    const obj = { date: new Date('2024-01-01'), regex: /test/g, name: 'hello' }
    deepFreeze(obj)
    expect(Object.isFrozen(obj)).toBe(true)
    expect(Object.isFrozen(obj.date)).toBe(false)
    expect(Object.isFrozen(obj.regex)).toBe(false)
  })
})

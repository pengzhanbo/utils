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
})

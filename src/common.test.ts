import { describe, expect, it } from 'vitest'
import { getTypeName } from './common'

describe('getTypeName', () => {
  it('should return type name', () => {
    expect(getTypeName(undefined)).toEqual('undefined')
    expect(getTypeName(null)).toEqual('null')
    expect(getTypeName(1)).toEqual('number')
    expect(getTypeName('1')).toEqual('string')
    expect(getTypeName(true)).toEqual('boolean')
    expect(getTypeName({})).toEqual('object')
    expect(getTypeName(() => {})).toEqual('function')
  })
})

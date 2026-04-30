import { describe, expect, it } from 'vitest'
import { capitalize } from './capitalize'

describe('string > capitalize', () => {
  it('should work', () => {
    expect(capitalize('')).toEqual('')
    expect(capitalize(' ')).toEqual(' ')
    expect(capitalize('foo')).toEqual('Foo')
    expect(capitalize('foo bar')).toEqual('Foo bar')
    expect(capitalize('Foo')).toEqual('Foo')
    expect(capitalize('FOO')).toEqual('Foo')
  })

  it('should handle emoji and characters outside BMP', () => {
    expect(capitalize('🌍hello')).toEqual('🌍hello')
    expect(capitalize('🎉ABC')).toEqual('🎉abc')
  })

  it('should handle supplementary Unicode characters (code point > 0xFFFF)', () => {
    expect(capitalize('𝄞music')).toEqual('𝄞music')
  })

  it('should handle BMP characters (code point <= 0xFFFF)', () => {
    expect(capitalize('hello')).toEqual('Hello')
    expect(capitalize('ABC')).toEqual('Abc')
  })
})

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
})

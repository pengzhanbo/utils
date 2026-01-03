import { describe, expect, it } from 'vitest'
import { upperCase } from './upper-case'

describe('string > upperCase', () => {
  it('should work', () => {
    expect(upperCase('')).toEqual('')
    expect(upperCase(' ')).toEqual('')
    expect(upperCase('foo')).toEqual('FOO')
    expect(upperCase('foo bar')).toEqual('FOO BAR')
    expect(upperCase('Foo')).toEqual('FOO')
    expect(upperCase('FOO')).toEqual('FOO')
    expect(upperCase('__foo_bar___')).toEqual('FOO BAR')
    expect(upperCase('snake_case')).toEqual('SNAKE CASE')
    expect(upperCase('kebab-case')).toEqual('KEBAB CASE')
    expect(upperCase('camelCase')).toEqual('CAMEL CASE')
    expect(upperCase('FOO_BAR')).toEqual('FOO BAR')
    expect(upperCase('special@characters!')).toEqual('SPECIAL CHARACTERS')
  })
})

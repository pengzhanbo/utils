import { describe, expect, it } from 'vitest'
import { constantCase } from './constant-case'

describe('string > constantCase', () => {
  it('should work', () => {
    expect(constantCase('')).toEqual('')
    expect(constantCase(' ')).toEqual('')
    expect(constantCase('foo')).toEqual('FOO')
    expect(constantCase('foo bar')).toEqual('FOO_BAR')
    expect(constantCase('Foo')).toEqual('FOO')
    expect(constantCase('FOO')).toEqual('FOO')
    expect(constantCase('__foo_bar___')).toEqual('FOO_BAR')
    expect(constantCase('snake_case')).toEqual('SNAKE_CASE')
    expect(constantCase('kebab-case')).toEqual('KEBAB_CASE')
    expect(constantCase('camelCase')).toEqual('CAMEL_CASE')
    expect(constantCase('FOO_BAR')).toEqual('FOO_BAR')
    expect(constantCase('special@characters!')).toEqual('SPECIAL_CHARACTERS')
  })
})

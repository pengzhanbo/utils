import { describe, expect, it } from 'vitest'
import { snakeCase } from './snake-case'

describe('string > snakeCase', () => {
  it('should work', () => {
    expect(snakeCase('')).toEqual('')
    expect(snakeCase(' ')).toEqual('')
    expect(snakeCase('foo')).toEqual('foo')
    expect(snakeCase('foo bar')).toEqual('foo_bar')
    expect(snakeCase('Foo')).toEqual('foo')
    expect(snakeCase('FOO')).toEqual('foo')
    expect(snakeCase('--foo-bar---')).toEqual('foo_bar')
    expect(snakeCase('kebab-case')).toEqual('kebab_case')
    expect(snakeCase('FOO_BAR')).toEqual('foo_bar')
    expect(snakeCase('special@characters!')).toEqual('special_characters')
  })
})

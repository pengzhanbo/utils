import { describe, expect, it } from 'vitest'
import { lowerCase } from './lower-case'

describe('string > lowerCase', () => {
  it('should work', () => {
    expect(lowerCase('')).toEqual('')
    expect(lowerCase(' ')).toEqual('')
    expect(lowerCase('foo')).toEqual('foo')
    expect(lowerCase('foo bar')).toEqual('foo bar')
    expect(lowerCase('Foo')).toEqual('foo')
    expect(lowerCase('FOO')).toEqual('foo')
    expect(lowerCase('__foo_bar___')).toEqual('foo bar')
    expect(lowerCase('snake_case')).toEqual('snake case')
    expect(lowerCase('kebab-case')).toEqual('kebab case')
    expect(lowerCase('camelCase')).toEqual('camel case')
    expect(lowerCase('FOO_BAR')).toEqual('foo bar')
    expect(lowerCase('special@characters!')).toEqual('special characters')
  })
})

import { describe, expect, it } from 'vitest'
import { camelCase } from './camel-case'

describe('string > camelCase', () => {
  it('should work', () => {
    expect(camelCase('')).toEqual('')
    expect(camelCase(' ')).toEqual('')
    expect(camelCase('foo')).toEqual('foo')
    expect(camelCase('foo bar')).toEqual('fooBar')
    expect(camelCase('Foo')).toEqual('foo')
    expect(camelCase('FOO')).toEqual('foo')
    expect(camelCase('__foo_bar___')).toEqual('fooBar')
    expect(camelCase('snake_case')).toEqual('snakeCase')
    expect(camelCase('kebab-case')).toEqual('kebabCase')
    expect(camelCase('FOO_BAR')).toEqual('fooBar')
    expect(camelCase('special@characters!')).toEqual('specialCharacters')
  })
})

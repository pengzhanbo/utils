import { describe, expect, it } from 'vitest'
import { pascalCase } from './pascal-case'

describe('string > pascalCase', () => {
  it('should work', () => {
    expect(pascalCase('')).toEqual('')
    expect(pascalCase(' ')).toEqual('')
    expect(pascalCase('foo')).toEqual('Foo')
    expect(pascalCase('foo bar')).toEqual('FooBar')
    expect(pascalCase('Foo')).toEqual('Foo')
    expect(pascalCase('FOO')).toEqual('Foo')
    expect(pascalCase('__foo_bar___')).toEqual('FooBar')
    expect(pascalCase('snake_case')).toEqual('SnakeCase')
    expect(pascalCase('kebab-case')).toEqual('KebabCase')
    expect(pascalCase('camelCase')).toEqual('CamelCase')
    expect(pascalCase('FOO_BAR')).toEqual('FooBar')
    expect(pascalCase('special@characters!')).toEqual('SpecialCharacters')
  })
})

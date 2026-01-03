import { describe, expect, it } from 'vitest'
import { kebabCase } from './kebab-case'

describe('string > kebabCase', () => {
  it('should work', () => {
    expect(kebabCase('')).toEqual('')
    expect(kebabCase(' ')).toEqual('')
    expect(kebabCase('foo')).toEqual('foo')
    expect(kebabCase('foo bar')).toEqual('foo-bar')
    expect(kebabCase('Foo')).toEqual('foo')
    expect(kebabCase('FOO')).toEqual('foo')
    expect(kebabCase('__foo_bar___')).toEqual('foo-bar')
    expect(kebabCase('snake_case')).toEqual('snake-case')
    expect(kebabCase('FOO_BAR')).toEqual('foo-bar')
    expect(kebabCase('special@characters!')).toEqual('special-characters')
  })
})
